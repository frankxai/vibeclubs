import { describe, expect, it } from 'vitest'
import { buildAgentJobEnvelope, evaluateAgentRunReadiness } from './runtime'

describe('agent runtime primitives', () => {
  it('builds a stable job envelope for ledgered work', () => {
    const job = buildAgentJobEnvelope({
      lane: 'guardian',
      requestedAction: 'moderation',
      scope: 'report',
      scopeId: '00000000-0000-0000-0000-000000000001',
      risk: 'high',
      createdAt: '2026-06-23T10:00:00.000Z',
    })

    expect(job.schema).toBe('vibeclubs.agent_job.v1')
    expect(job.idempotency_key).toContain('guardian:moderation:report')
    expect(job.attempts).toBe(0)
  })

  it('passes readiness when review gate and evidence are aligned', () => {
    const result = evaluateAgentRunReadiness({
      scope: 'social_draft',
      requestedAction: 'send_external',
      risk: 'normal',
      approvalRequired: true,
      evidence: { source: 'draft' },
    })

    expect(result.passed).toBe(true)
    expect(result.score).toBe(100)
  })

  it('fails readiness when high-risk work is not review gated', () => {
    const result = evaluateAgentRunReadiness({
      scope: 'billing',
      requestedAction: 'billing',
      risk: 'high',
      approvalRequired: false,
      evidence: {},
    })

    expect(result.passed).toBe(false)
    expect(result.checks.reviewGateAligned).toBe(false)
    expect(result.checks.hasEvidence).toBe(false)
  })
})
