create table if not exists public.user (
  id text primary key,
  email text,
  "isPro" boolean not null default false,
  "proUpdatedAt" timestamptz,
  "aiWindowAt" timestamptz,
  "aiRequestCount" integer not null default 0,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.interest_list_entry (
  id text primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  name text not null,
  email text
);

create index if not exists interest_list_entry_createdAt_idx
  on public.interest_list_entry ("createdAt");

alter table public.user enable row level security;
alter table public.interest_list_entry enable row level security;

create or replace function public.consume_ai_rate_limit(p_user_id text)
returns boolean
language sql
security invoker
set search_path = public
as $$
  with updated as (
    update public.user
    set "aiRequestCount" = case
          when "aiWindowAt" is null or "aiWindowAt" < now() - interval '1 minute' then 1
          else "aiRequestCount" + 1
        end,
        "aiWindowAt" = case
          when "aiWindowAt" is null or "aiWindowAt" < now() - interval '1 minute' then now()
          else "aiWindowAt"
        end
    where id = p_user_id
      and "isPro" = true
      and ("aiWindowAt" is null
           or "aiWindowAt" < now() - interval '1 minute'
           or "aiRequestCount" < 20)
    returning id
  )
  select exists (select 1 from updated)
$$;