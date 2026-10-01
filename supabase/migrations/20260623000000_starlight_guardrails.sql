-- Starlight guardrails: explicit consent, agent approvals, and testable policy seams.

set check_function_bodies = off;

alter table public.session_participants
  add column if not exists consent_version text not null default 'vibeclubs.consent.v1',
  add column if not exists witness_consent boolean not null default false,
  add column if not exists recap_consent boolean not null default false,
  add column if not exists card_consent boolean not null default false,
  add column if not exists social_consent boolean not null default false;

alter table public.session_cards
  add column if not exists consent_snapshot jsonb not null default '{}'::jsonb;

alter table public.agent_runs
  add column if not exists requested_action text not null default 'draft',
  add column if not exists approval_required boolean not null default true,
  add column if not exists approval_state text not null default 'pending',
  add column if not exists approved_by uuid references public.users(id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists blocked_reason text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'agent_runs_requested_action_check'
      and conrelid = 'public.agent_runs'::regclass
  ) then
    alter table public.agent_runs add constraint agent_runs_requested_action_check
      check (
        requested_action in (
          'draft',
          'recap',
          'card',
          'social_draft',
          'send_external',
          'moderation',
          'billing',
          'export',
          'delete',
          'admin_write'
        )
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'agent_runs_approval_state_check'
      and conrelid = 'public.agent_runs'::regclass
  ) then
    alter table public.agent_runs add constraint agent_runs_approval_state_check
      check (approval_state in ('not_required', 'pending', 'approved', 'rejected', 'blocked'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'agent_runs_high_risk_requires_approval'
      and conrelid = 'public.agent_runs'::regclass
  ) then
    alter table public.agent_runs add constraint agent_runs_high_risk_requires_approval
      check (risk not in ('high', 'sovereign') or approval_required = true);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'agent_runs_irreversible_requires_approval'
      and conrelid = 'public.agent_runs'::regclass
  ) then
    alter table public.agent_runs add constraint agent_runs_irreversible_requires_approval
      check (
        requested_action not in (
          'send_external',
          'moderation',
          'billing',
          'export',
          'delete',
          'admin_write'
        )
        or approval_required = true
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'agent_runs_approved_state_requires_reviewer'
      and conrelid = 'public.agent_runs'::regclass
  ) then
    alter table public.agent_runs add constraint agent_runs_approved_state_requires_reviewer
      check (approval_state <> 'approved' or (approved_by is not null and approved_at is not null));
  end if;
end $$;

create index if not exists session_participants_consent_idx
  on public.session_participants (user_id, witness_consent, recap_consent, card_consent);

create index if not exists agent_runs_approval_idx
  on public.agent_runs (approval_state, approval_required, created_at desc);

