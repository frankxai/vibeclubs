-- Vibeclubs initial schema.
-- ADR-002: Format, not Platform. Tables describe the directory + session layer.
-- Run via Supabase SQL editor or `supabase db push` after linking the project.

set check_function_bodies = off;

-- =========================================================================
-- Enums
-- =========================================================================

create type public.club_type as enum (
  'coding', 'music', 'design', 'study', 'fitness', 'writing', 'other'
);

create type public.club_platform as enum (
  'meet', 'discord', 'zoom', 'in_person', 'other'
);

create type public.pomodoro_preset as enum (
  '25_5', '50_10', '90_20', 'custom'
);

create type public.user_tier as enum (
  'free', 'builder', 'opener'
);

create type public.club_tier as enum (
  'free', 'featured'
);

create type public.member_role as enum (
  'owner', 'opener', 'builder'
);

-- =========================================================================
-- Tables
-- =========================================================================

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  handle text unique,
  display_name text,
  avatar_url text,
  bio text,
  links jsonb not null default '{}'::jsonb,
  tier public.user_tier not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_handle_idx on public.users (handle);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  type public.club_type not null,
  platform public.club_platform not null,
  platform_url text,
  schedule text,
  pomodoro_preset public.pomodoro_preset not null default '25_5',
  pomodoro_custom jsonb,
  ambient_preset text not null default 'lofi',
  suno_genre text,
  opener_id uuid not null references public.users(id) on delete cascade,
  tier public.club_tier not null default 'free',
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clubs_type_idx on public.clubs (type);
create index clubs_platform_idx on public.clubs (platform);
create index clubs_opener_idx on public.clubs (opener_id);
create index clubs_active_idx on public.clubs (is_active) where is_active = true;

create table public.club_members (
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.member_role not null default 'builder',
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create index club_members_user_idx on public.club_members (user_id);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete set null,
  user_id uuid not null references public.users(id) on delete cascade,
  platform_used public.club_platform,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  focus_minutes integer not null default 0,
  break_minutes integer not null default 0,
  pomodoro_cycles integer not null default 0,
  session_card_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index sessions_user_idx on public.sessions (user_id, started_at desc);
create index sessions_club_idx on public.sessions (club_id, started_at desc);

create table public.tool_recommendations (
  id uuid primary key default gen_random_uuid(),
  club_type public.club_type not null,
  tool_name text not null,
  tool_url text not null,
  category text not null,
  description text,
  affiliate_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index tool_recs_type_idx on public.tool_recommendations (club_type);

-- =========================================================================
-- Updated-at trigger
-- =========================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at before update on public.users
  for each row execute procedure public.set_updated_at();

create trigger clubs_updated_at before update on public.clubs
  for each row execute procedure public.set_updated_at();

-- =========================================================================
-- Auth bridge: when an auth.users row appears, create a public.users row
-- =========================================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- =========================================================================
-- Row-Level Security
-- =========================================================================

alter table public.users enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.sessions enable row level security;
alter table public.tool_recommendations enable row level security;

-- users: anyone can read public profile info, only self can update
create policy users_read on public.users for select using (true);
create policy users_update_self on public.users for update using (auth.uid() = id);

-- clubs: active clubs are public read; opener can do anything; members can read inactive
create policy clubs_read_active on public.clubs for select using (is_active = true);
create policy clubs_read_own on public.clubs for select using (auth.uid() = opener_id);
create policy clubs_insert_self on public.clubs for insert with check (auth.uid() = opener_id);
create policy clubs_update_own on public.clubs for update using (auth.uid() = opener_id);
create policy clubs_delete_own on public.clubs for delete using (auth.uid() = opener_id);

-- club_members: members can read membership of clubs they belong to; users manage their own
create policy club_members_read on public.club_members for select using (
  auth.uid() = user_id
  or exists (select 1 from public.club_members m where m.club_id = club_members.club_id and m.user_id = auth.uid())
);
create policy club_members_insert_self on public.club_members for insert with check (auth.uid() = user_id);
create policy club_members_delete_self on public.club_members for delete using (auth.uid() = user_id);

-- sessions: users read and write their own; club openers read their club's
create policy sessions_read_own on public.sessions for select using (auth.uid() = user_id);
create policy sessions_read_opener on public.sessions for select using (
  exists (select 1 from public.clubs c where c.id = sessions.club_id and c.opener_id = auth.uid())
);
create policy sessions_insert_self on public.sessions for insert with check (auth.uid() = user_id);
create policy sessions_update_self on public.sessions for update using (auth.uid() = user_id);

-- tool_recommendations: public read, admin-only write (via service role)
create policy tool_recs_read on public.tool_recommendations for select using (true);

-- =========================================================================
-- Seed: a handful of tool recommendations so /club pages aren't empty
-- =========================================================================

insert into public.tool_recommendations (club_type, tool_name, tool_url, category, description) values
  ('coding', 'Cursor', 'https://cursor.com', 'editor', 'AI-first code editor'),
  ('coding', 'Replit', 'https://replit.com', 'environment', 'Collaborative cloud IDE'),
  ('music', 'Suno', 'https://suno.com', 'generation', 'AI music generation for session tracks'),
  ('music', 'Ableton Live', 'https://ableton.com', 'daw', 'Industry-standard DAW for live music'),
  ('design', 'Figma', 'https://figma.com', 'design', 'Collaborative design tool'),
  ('writing', 'Obsidian', 'https://obsidian.md', 'notes', 'Markdown-native knowledge base'),
  ('study', 'Anki', 'https://apps.ankiweb.net', 'flashcards', 'Spaced-repetition flashcards')
on conflict do nothing;
