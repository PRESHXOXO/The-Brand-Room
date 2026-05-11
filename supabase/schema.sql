create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  designer_role text not null,
  instagram_portfolio_link text not null,
  source text not null default 'landing_page'
);

alter table public.waitlist_signups enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'waitlist_signups'
      and indexdef ilike '%unique%'
      and indexdef ilike '%(email)%'
  ) then
    create unique index waitlist_signups_email_unique
      on public.waitlist_signups (email);
  end if;
end $$;

grant insert on public.waitlist_signups to anon;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'waitlist_signups'
      and policyname = 'Allow public waitlist signups'
  ) then
    create policy "Allow public waitlist signups"
      on public.waitlist_signups
      for insert
      to anon
      with check (source = 'landing_page');
  end if;
end $$;
