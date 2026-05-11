create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  designer_role text not null,
  instagram_portfolio_link text not null,
  source text not null default 'landing_page',
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;
