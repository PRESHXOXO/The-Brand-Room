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

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  image_url text,
  caption text,
  category text,
  project_stage text,
  tags text[] default '{}'::text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.posts
  add column if not exists id uuid default gen_random_uuid();

alter table public.posts
  add column if not exists user_id uuid;

alter table public.posts
  add column if not exists image_url text;

alter table public.posts
  add column if not exists caption text;

alter table public.posts
  add column if not exists category text;

alter table public.posts
  add column if not exists project_stage text;

alter table public.posts
  add column if not exists tags text[] default '{}'::text[];

alter table public.posts
  add column if not exists created_at timestamp with time zone default now();

alter table public.posts
  add column if not exists updated_at timestamp with time zone default now();

alter table public.posts
  alter column id set default gen_random_uuid();

alter table public.posts
  alter column tags set default '{}'::text[];

alter table public.posts
  alter column created_at set default now();

alter table public.posts
  alter column updated_at set default now();

do $$
declare
  existing_constraint text;
begin
  for existing_constraint in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    join unnest(c.conkey) with ordinality as keys(attnum, ord) on true
    join pg_attribute a on a.attrelid = t.oid and a.attnum = keys.attnum
    where n.nspname = 'public'
      and t.relname = 'posts'
      and c.contype = 'f'
      and a.attname = 'user_id'
  loop
    execute format('alter table public.posts drop constraint if exists %I', existing_constraint);
  end loop;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_user_id_auth_users_fkey'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
      add constraint posts_user_id_auth_users_fkey
      foreign key (user_id)
      references auth.users(id)
      on delete cascade;
  end if;
end $$;

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

create index if not exists posts_user_id_idx
  on public.posts (user_id);

drop trigger if exists posts_set_updated_at on public.posts;

create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

alter table public.posts enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (
  user_id,
  image_url,
  caption,
  category,
  project_stage,
  tags
) on public.posts to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'posts'
      and policyname = 'Public posts are viewable'
  ) then
    create policy "Public posts are viewable"
      on public.posts
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'posts'
      and policyname = 'Users can create their own posts'
  ) then
    create policy "Users can create their own posts"
      on public.posts
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'post-images',
  'post-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public post images are viewable'
  ) then
    create policy "Public post images are viewable"
      on storage.objects
      for select
      to anon, authenticated
      using (bucket_id = 'post-images');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload their own post images'
  ) then
    create policy "Users can upload their own post images"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'post-images'
        and (storage.foldername(name))[1] = (select auth.uid()::text)
      );
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
