create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  designer_role text not null,
  instagram_portfolio_link text not null,
  source text not null default 'landing_page'
);

alter table public.waitlist_signups
  alter column id set default gen_random_uuid();

alter table public.waitlist_signups
  alter column source set default 'landing_page';

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

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  designer_title text,
  bio text,
  specialty text,
  instagram_portfolio_link text,
  location text,
  avatar_url text,
  available_for_work boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles
  alter column available_for_work set default false;

alter table public.profiles
  alter column created_at set default now();

alter table public.profiles
  alter column updated_at set default now();

do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'profiles'
      and indexdef ilike '%unique%'
      and indexdef ilike '%(username)%'
  ) then
    create unique index profiles_username_unique
      on public.profiles (username);
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert (
  id,
  full_name,
  username,
  designer_title,
  bio,
  specialty,
  instagram_portfolio_link,
  location,
  avatar_url,
  available_for_work
) on public.profiles to authenticated;
grant update (
  id,
  full_name,
  username,
  designer_title,
  bio,
  specialty,
  instagram_portfolio_link,
  location,
  avatar_url,
  available_for_work
) on public.profiles to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Public profiles are viewable'
  ) then
    create policy "Public profiles are viewable"
      on public.profiles
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on public.profiles
      for insert
      to authenticated
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on public.profiles
      for update
      to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

grant usage on schema public to anon;
grant insert (
  name,
  email,
  designer_role,
  instagram_portfolio_link,
  source
) on public.waitlist_signups to anon;

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
