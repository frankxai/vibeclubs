import { describe, expect, test } from 'vitest'
import { CONSENT_SCHEMA_VERSION, validateExportBundle } from '@starlight/communities-standard'
import { buildDataExportBundle, STARLIGHT_EXPORT_VERSION } from './export'

describe('buildDataExportBundle', () => {
  test('wraps portable user data in a stable Starlight envelope', () => {
    const bundle = buildDataExportBundle({
      subject: { user_id: 'user-1', exported_at: '2026-06-21T00:00:00.000Z' },
      profile: { handle: 'frank' },
      ownedClubs: [{ slug: 'lofi-coders' }],
      memberships: [],
      sessions: [{ id: 'session-1' }],
      sessionCards: [
        {
          id: 'card-1',
          consent_snapshot: {
            version: CONSENT_SCHEMA_VERSION,
            witness: true,
            recap: true,
            card: true,
            social: false,
            source: 'explicit',
            captured_at: '2026-06-21T00:00:00.000Z',
          },
        },
      ],
      agentRuns: [
        {
          id: 'agent-run-1',
          requested_action: 'send_external',
          risk: 'high',
          status: 'needs_review',
          approval_required: true,
          approval_state: 'pending',
          evidence: { source: 'test' },
        },
      ],
      reports: [],
      socialDrafts: [{ channel: 'x' }],
    })

    expect(bundle.schema).toBe(STARLIGHT_EXPORT_VERSION)
    expect(bundle.subject_user_id).toBe('user-1')
    expect(bundle.portability.federation_ready).toBe(true)
    expect(bundle.data.owned_clubs).toHaveLength(1)
    expect(bundle.data.session_cards).toHaveLength(1)
    expect(bundle.data.agent_runs).toHaveLength(1)
    expect(validateExportBundle(bundle)).toMatchObject({
      ok: true,
      levels: { L1: true, L2: true, L3: true },
    })
  })
})
