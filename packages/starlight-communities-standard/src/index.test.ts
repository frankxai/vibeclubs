import { describe, expect, it } from 'vitest'
import {
  CONSENT_SCHEMA_VERSION,
  STARLIGHT_EXPORT_SCHEMA,
  assertConformantExport,
  validateAgentRunGuardrail,
  validateConsentSnapshot,
  validateExportBundle,
} from './index'

const consent = {
  version: CONSENT_SCHEMA_VERSION,
  witness: true,
  recap: true,
  card: true,
  social: false,
  source: 'explicit',
  captured_at: '2026-06-23T10:00:00.000Z',
}

const bundle = {
  schema: STARLIGHT_EXPORT_SCHEMA,
  exported_at: '2026-06-23T10:00:00.000Z',
  subject_user_id: 'user_1',
  portability: {
    format: 'json',
    federation_ready: true,
    notes: [],
  },
  data: {
    profile: null,
    owned_clubs: [],
    memberships: [],
    sessions: [],
    session_cards: [
      {
        consent_snapshot: consent,
      },
    ],
    agent_runs: [
      {
        requested_action: 'send_external',
        risk: 'high',
        status: 'needs_review',
        approval_required: true,
        approval_state: 'pending',
        evidence: {},
      },
    ],
    reports: [],
    social_drafts: [],
  },
}

describe('@starlight/communities-standard', () => {
  it('accepts a conformant export bundle through L3', () => {
    const report = validateExportBundle(bundle)
    expect(report.ok).toBe(true)
    expect(report.levels.L1).toBe(true)
    expect(report.levels.L2).toBe(true)
    expect(report.levels.L3).toBe(true)
    expect(() => assertConformantExport(bundle)).not.toThrow()
  })

  it('rejects card artifacts without consent snapshots', () => {
    const report = validateExportBundle({
      ...bundle,
      data: {
        ...bundle.data,
        session_cards: [{}],
      },
    })
    expect(report.ok).toBe(false)
    expect(report.issues.some((item) => item.code === 'card.consent_snapshot')).toBe(true)
  })

  it('rejects irreversible agent work without approval', () => {
    const issues = validateAgentRunGuardrail({
      requested_action: 'delete',
      risk: 'normal',
      status: 'queued',
      approval_required: false,
      approval_state: 'not_required',
      evidence: {},
    })
    expect(issues.some((item) => item.code === 'agent.review_required')).toBe(true)
  })

  it('validates consent snapshots', () => {
    expect(validateConsentSnapshot(consent)).toHaveLength(0)
    expect(validateConsentSnapshot({ ...consent, recap: 'yes' })).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'consent.recap' })]),
    )
  })
})
