begin;

-- Refuse ambiguous legacy data without discarding an owner's edits.
lock table public.site_settings in access exclusive mode;
do $$ begin
  if (select count(*) from public.site_settings) > 1 then
    raise exception 'Merge duplicate site_settings rows before applying this migration';
  end if;
end $$;
alter table public.site_settings add column singleton boolean not null default true unique check (singleton);
alter table public.site_settings alter name set default 'Omved Nagre', alter role set default 'Developer', alter tagline set default '';
insert into public.site_settings (singleton) values (true) on conflict (singleton) do nothing;
update public.site_settings set name = 'Omved Nagre',
  github_url = nullif(github_url, 'https://github.com'), linkedin_url = nullif(linkedin_url, 'https://linkedin.com'),
  resume_url = nullif(resume_url, 'https://example.com/resume.pdf'), email = nullif(email, 'hello@johndoe.com')
where name = 'JOHN DOE' and email = 'hello@johndoe.com';
alter table public.projects add column if not exists status text default 'Completed';
alter table public.skills alter column score set default 0;

create function public.is_portfolio_owner() returns boolean language sql stable
set search_path = '' as $$
  select coalesce((auth.jwt() -> 'app_metadata' -> 'portfolio_owner') = 'true'::jsonb, false)
$$;
do $$
declare tbl text;
begin
  foreach tbl in array array['site_settings','projects','skills','experience','services'] loop
    execute format('grant select on public.%I to anon, authenticated', tbl);
    execute format('grant insert, update, delete on public.%I to authenticated', tbl);
    execute format('revoke truncate on public.%I from anon, authenticated, public', tbl);
    execute format('drop policy if exists %I on public.%I', 'Authenticated users can manage ' || replace(tbl,'_',' '), tbl);
    execute format('create policy owner_write on public.%I for all to authenticated using ((select public.is_portfolio_owner())) with check ((select public.is_portfolio_owner()))', tbl);
    -- Also constrain any permissive write policies left by older deployments.
    execute format('create policy owner_insert_guard on public.%I as restrictive for insert with check ((select public.is_portfolio_owner()))', tbl);
    execute format('create policy owner_update_guard on public.%I as restrictive for update using ((select public.is_portfolio_owner())) with check ((select public.is_portfolio_owner()))', tbl);
    execute format('create policy owner_delete_guard on public.%I as restrictive for delete using ((select public.is_portfolio_owner()))', tbl);
  end loop;
end $$;

-- Keep the shared settings row available even if a client issues a delete.
create policy keep_profile on public.site_settings as restrictive for delete using (false);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check(length(trim(name)) between 1 and 120),
  email text not null check(length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  message text not null check(length(trim(message)) between 1 and 5000)
);
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated, public;
grant insert(name,email,message) on public.inquiries to anon, authenticated;
grant select on public.inquiries to authenticated;
create policy submit_inquiry on public.inquiries for insert to anon, authenticated with check (true);
create policy owner_inbox on public.inquiries for select to authenticated using ((select public.is_portfolio_owner()));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('resumes','resumes',true,5242880,array['application/pdf'])
on conflict (id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Allow authenticated resume uploads" on storage.objects;
drop policy if exists "Allow authenticated resume updates" on storage.objects;
drop policy if exists "Allow authenticated resume deletes" on storage.objects;
create policy resume_owner on storage.objects for all to authenticated
using (bucket_id='resumes' and (select public.is_portfolio_owner()))
with check (bucket_id='resumes' and (select public.is_portfolio_owner()));
create policy resume_insert_guard on storage.objects as restrictive for insert with check (bucket_id <> 'resumes' or (select public.is_portfolio_owner()));
create policy resume_update_guard on storage.objects as restrictive for update using (bucket_id <> 'resumes' or (select public.is_portfolio_owner())) with check (bucket_id <> 'resumes' or (select public.is_portfolio_owner()));
create policy resume_delete_guard on storage.objects as restrictive for delete using (bucket_id <> 'resumes' or (select public.is_portfolio_owner()));
commit;
