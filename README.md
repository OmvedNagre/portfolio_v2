# Omved Nagre’s portfolio

The public portfolio runs at `/`. The owner signs in at `/admin` to manage projects, skills, services, experience, contact details and a PDF résumé. The contact form stores messages in the private **Inquiries** tab. The owner can reply using the visitor’s email link. The application does not send email notifications.

## Run locally

Use Node.js 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Supabase project URL and public client key. Vite embeds these values in the browser build. Keep service-role keys and database credentials out of the frontend. Start the app with `npm run dev`.

## Set up Supabase

Apply SQL as the database administrator using the SQL Editor.

1. **New project:** run `supabase/schema.sql` once to create the five content tables. Then run `supabase/migrations/20261104_portfolio.sql` once.
2. **Existing portfolio:** back up the database and run **only** `supabase/migrations/20261104_portfolio.sql`. It upgrades the legacy tables in a transaction, keeps existing skills and project data, and sets up the public PDF bucket and private inbox. If multiple settings rows exist, the transaction stops. Inspect and merge those rows into the intended profile before retrying. Review previously seeded experience statistics in the dashboard and remove any that do not describe your work.
3. In Supabase Authentication, create or identify the owner's email/password account. Copy its **user UUID**. Run the following SQL after replacing the placeholder with that UUID. Verify that it updates exactly one account.

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                        || '{"portfolio_owner": true}'::jsonb
where id = 'REPLACE_WITH_OWNER_UUID'::uuid
returning id, email;
```

Sign out and sign back in to refresh the access token. Grant this flag only through administrative access. To revoke access, remove the flag from `raw_app_meta_data` and revoke the user's sessions. Previously issued access tokens can remain valid until expiry. Public visitors can read portfolio content and submit inquiries. Only designated owners can edit it or read inquiries. No public signup is needed for this site.

## Content and storage

Settings and About update different fields on one profile. Blank contact fields stay hidden. Projects accept hosted image URLs. The résumé editor accepts PDFs up to 5 MiB and uploads the selected file on Save. Replacement publishes the new link before deleting the previous managed file. If a cleanup error is reported or a network interruption leaves a file's status uncertain, compare the saved link with objects in the `resumes` bucket before manually removing unused PDFs.

## Verification

- `npm run lint` checks the source.
- `npm test` exercises the migration and access policies in an isolated PostgreSQL runtime.
- `npm run build` type-checks and produces the static site in `dist/`.
- Run `npx playwright install chromium` once, then `npm run test:e2e`. Browser tests build a separate fixture-backed site on port 4193, covering public navigation, contact retries, and owner access. They do not use hosted accounts or data.

## Deploy on Vercel

Apply the database migration and grant owner access before releasing the frontend. Configure the same two public environment variables in Vercel and rebuild. Use the Vite preset, `npm run build` and the `dist` output directory. The included rewrite supports direct links. After deployment, submit a test inquiry, check the owner inbox, save a skill, and replace or remove a test PDF to validate the connected services.
