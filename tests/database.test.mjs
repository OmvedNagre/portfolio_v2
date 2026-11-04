import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

test('legacy migration, grants, inquiry privacy and owner-only writes', async () => {
  const db = new PGlite();
  try {
    // Model the Supabase-provided schemas, roles and data API table grants.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create function auth.jwt() returns jsonb language sql as
        $$ select coalesce(nullif(current_setting('request.jwt.claims',true), ''),'{}')::jsonb $$;
      grant usage on schema auth, storage to anon, authenticated;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text);
      alter table storage.objects enable row level security;
      grant all on storage.objects to authenticated;
      alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
    `);
    await db.exec(readFileSync('supabase/schema.sql','utf8'));
    await db.exec(`
      alter table projects drop column status;
      create policy "Authenticated users can manage projects" on projects for all to authenticated using (true);
      create policy old_upload on storage.objects for insert to authenticated with check (true);
      insert into site_settings(name,role,tagline) values('Existing owner','Engineer','Existing tagline');
    `);
    const migration = readFileSync('supabase/migrations/20261104_portfolio.sql','utf8');
    await db.exec(migration);
    assert.equal((await db.query('select name from site_settings')).rows[0].name,'Existing owner');
    await assert.rejects(db.exec('insert into site_settings default values'), /unique/);
    await db.exec("set role anon; insert into inquiries(name,email,message) values('Visitor','visitor@example.com','Hello');");
    await assert.rejects(db.exec('select * from inquiries'), /permission denied/);
    await db.exec("set role authenticated; set request.jwt.claims = '{\"user_metadata\":{\"portfolio_owner\":true}}'");
    assert.equal((await db.query('select * from inquiries')).rows.length, 0);
    await assert.rejects(db.exec("insert into skills(category,skills_list) values('Test','{}')"), /security policy/);
    await assert.rejects(db.exec("insert into storage.objects(bucket_id) values('resumes')"), /security policy/);
    assert.equal((await db.query("delete from site_settings returning id")).rows.length, 0);
    await db.exec(`set request.jwt.claims = '{"app_metadata":{"portfolio_owner":true}}'`);
    assert.equal((await db.query('select message from inquiries')).rows[0].message,'Hello');
    await db.exec("insert into storage.objects(bucket_id) values('resumes'); insert into skills(category,skills_list) values('Tools','{Git}');");
    assert.equal((await db.query('select score from skills')).rows[0].score,0);
    assert.equal((await db.query("select status from projects")).rows.length, 0);
  } finally {
    await db.close();
  }
});
