import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const migrations = [
  readFileSync(join(process.cwd(), 'supabase/migrations/20260419000000_init.sql'), 'utf8'),
  readFileSync(
    join(process.cwd(), 'supabase/migrations/20260621000000_starlight_communities.sql'),
    'utf8',
  ),
  readFileSync(
    join(process.cwd(), 'supabase/migrations/20260623000000_starlight_guardrails.sql'),
    'utf8',
  ),
].join('\n')

describe('Starlight sovereignty database contract', () => {
  const protectedTables = [
    'session_participants',
    'session_cards',
    'agent_runs',
    'reports',
    'moderation_actions',
    'data_exports',
    'social_drafts',
  ]

  test.each(protectedTables)('%s has RLS enabled', (table) => {
    expect(migrations).toContain(`alter table public.${table} enable row level security`)
  })

  test('portable rows are scoped to auth.uid policies', () => {
    for (const policy of [
      'session_participants_insert_self',
      'session_cards_insert_self',
      'agent_runs_insert_actor',
      'reports_insert_own',
      'data_exports_insert_own',
      'social_drafts_insert_own',
    ]) {
      expect(migrations).toContain(`create policy ${policy}`)
    }

    expect(migrations.match(/auth\.uid\(\)/g)?.length ?? 0).toBeGreaterThanOrEqual(18)
  })

  test('moderation action writes remain service-role only', () => {
    expect(migrations).not.toMatch(/create policy moderation_actions_insert/i)
    expect(migrations).not.toMatch(/create policy moderation_actions_update/i)
  })

  test('consent and approval constraints are explicit', () => {
    for (const column of [
      'witness_consent',
      'recap_consent',
      'card_consent',
      'social_consent',
      'consent_snapshot',
      'approval_required',
      'approval_state',
      'requested_action',
    ]) {
      expect(migrations).toContain(column)
    }

    expect(migrations).toContain('agent_runs_high_risk_requires_approval')
    expect(migrations).toContain('agent_runs_irreversible_requires_approval')
  })
})
