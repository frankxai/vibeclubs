-- Starlight Communities v1 substrate for Vibeclubs.
-- Adds portable artifacts, report/moderation rails, agent evidence, and export bundles.

set check_function_bodies = off;

-- Keep the original init migration stable, then extend the preset enum here.
alter type public.pomodoro_preset add value if not exists 'vibe_coding_sprint';
alter type public.pomodoro_preset add value if not exists 'music_jam';
alter type public.pomodoro_preset add value if not exists 'dance_break';
alter type public.pomodoro_preset add value if not exists 'lightning';

-- =========================================================================
-- Tables
-- =========================================================================

create table if not exists public.session_participants (
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.member_role not null default 'builder',
  focus_minutes integer not null default 0,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  primary key (session_id, user_id)
);

create index if not exists session_participants_user_idx
  on public.session_participants (user_id, joined_at desc);

create table if not exists public.session_cards (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete set null,
  image_url text,
  svg_hash text,
  public_payload jsonb not null default '{}'::jsonb,
  attestation jsonb not null default '{}'::jsonb,
  visibility text not null default 'public' check (visibility in ('public', 'unlisted', 'private')),
  created_at timestamptz not null default now()
);

create index if not exists session_cards_user_idx
  on public.session_cards (user_id, created_at desc);
create index if not exists session_cards_club_idx
  on public.session_cards (club_id, created_at desc);
create index if not exists session_cards_public_idx
  on public.session_cards (created_at desc) where visibility = 'public';

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  agent text not null,
  lane text not null,
  scope text not null,
  scope_id uuid,
  status text not null default 'draft' check (
    status in ('draft', 'queued', 'running', 'needs_review', 'approved', 'blocked', 'failed', 'completed')
  ),
  risk text not null default 'normal' check (risk in ('low', 'normal', 'high', 'sovereign')),
  input_summary text,
  output_summary text,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists agent_runs_scope_idx on public.agent_runs (scope, scope_id);
create index if not exists agent_runs_status_idx on public.agent_runs (status, created_at desc);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  subject_type text not null check (subject_type in ('club', 'session', 'card', 'profile', 'other')),
  subject_id uuid,
  reason text not null check (reason in ('spam', 'abuse', 'privacy', 'safety', 'ip', 'other')),
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists reports_reporter_idx on public.reports (reporter_id, created_at desc);
create index if not exists reports_subject_idx on public.reports (subject_type, subject_id);
create index if not exists reports_status_idx on public.reports (status, created_at desc);

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  reviewer_id uuid references public.users(id) on delete set null,
  action text not null check (action in ('no_action', 'hide', 'rate_limit', 'suspend', 'escalate', 'restore')),
  subject_type text not null check (subject_type in ('club', 'session', 'card', 'profile', 'other')),
  subject_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists moderation_actions_report_idx on public.moderation_actions (report_id);
create index if not exists moderation_actions_subject_idx on public.moderation_actions (subject_type, subject_id);

create table if not exists public.data_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'ready' check (status in ('queued', 'ready', 'expired', 'failed')),
  format text not null default 'starlight_v1',
  bundle jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists data_exports_user_idx on public.data_exports (user_id, created_at desc);

create table if not exists public.social_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_card_id uuid references public.session_cards(id) on delete set null,
  channel text not null check (
    channel in ('x', 'threads', 'linkedin', 'tiktok', 'youtube', 'farcaster', 'bluesky', 'other')
  ),
  body text not null,
  status text not null default 'draft' check (
    status in ('draft', 'needs_review', 'approved', 'scheduled', 'published', 'rejected')
  ),
  approval_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists social_drafts_user_idx on public.social_drafts (user_id, created_at desc);
create index if not exists social_drafts_status_idx on public.social_drafts (status, created_at desc);

-- =========================================================================
-- Row-Level Security
-- =========================================================================

alter table public.session_participants enable row level security;
alter table public.session_cards enable row level security;
alter table public.agent_runs enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.data_exports enable row level security;
alter table public.social_drafts enable row level security;

create policy session_participants_read_own on public.session_participants
  for select using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.sessions s
      join public.clubs c on c.id = s.club_id
      where s.id = session_participants.session_id and c.opener_id = auth.uid()
    )
  );
create policy session_participants_insert_self on public.session_participants
  for insert with check (auth.uid() = user_id);
create policy session_participants_update_self on public.session_participants
  for update using (auth.uid() = user_id);

create policy session_cards_read_public on public.session_cards
  for select using (visibility = 'public');
create policy session_cards_read_own on public.session_cards
  for select using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.clubs c
      where c.id = session_cards.club_id and c.opener_id = auth.uid()
    )
  );
create policy session_cards_insert_self on public.session_cards
  for insert with check (auth.uid() = user_id);
create policy session_cards_update_self on public.session_cards
  for update using (auth.uid() = user_id);

create policy agent_runs_read_actor on public.agent_runs
  for select using (auth.uid() = actor_user_id);
create policy agent_runs_insert_actor on public.agent_runs
  for insert with check (auth.uid() = actor_user_id);
create policy agent_runs_update_actor on public.agent_runs
  for update using (auth.uid() = actor_user_id);

create policy reports_read_own on public.reports
  for select using (auth.uid() = reporter_id);
create policy reports_insert_own on public.reports
  for insert with check (auth.uid() = reporter_id);

-- Moderation actions are service-role only until an explicit reviewer role exists.

create policy data_exports_read_own on public.data_exports
  for select using (auth.uid() = user_id);
create policy data_exports_insert_own on public.data_exports
  for insert with check (auth.uid() = user_id);

create policy social_drafts_read_own on public.social_drafts
  for select using (auth.uid() = user_id);
create policy social_drafts_insert_own on public.social_drafts
  for insert with check (auth.uid() = user_id);
create policy social_drafts_update_own on public.social_drafts
  for update using (auth.uid() = user_id);
create policy social_drafts_delete_own on public.social_drafts
  for delete using (auth.uid() = user_id);
