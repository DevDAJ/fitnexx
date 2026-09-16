-- User-submitted bug reports (web modal + mobile settings card).
-- Run once in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.bug_report (
  id uuid primary key default gen_random_uuid(),
  description text not null check (char_length(description) between 10 and 8000),
  platform text not null check (platform in ('web', 'mobile')),
  browser text,
  os text,
  url text,
  created_at timestamptz not null default now()
);

alter table public.bug_report enable row level security;

-- Web inserts go through the service-role key (bypasses RLS).
-- Mobile inserts use the anon key, so allow public inserts.
-- No select/update/delete policies: reports are read in the dashboard only.
drop policy if exists "Allow public bug report inserts" on public.bug_report;
create policy "Allow public bug report inserts"
  on public.bug_report
  for insert
  to anon
  with check (true);
