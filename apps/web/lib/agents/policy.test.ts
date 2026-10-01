import { describe, expect, test } from 'vitest'
import {
  buildConsentSnapshot,
  canCreatePortableCard,
  canStreamRecap,
  resolveAgentRunPolicy,
} from './policy'

describe('agent and consent policy', () => {
  test('forces risky and external agent actions into review', () => {
    expect(
      resolveAgentRunPolicy({
        requestedAction: 'send_external',
        risk: 'normal',
        status: 'completed',
      }),
    ).toMatchObject({
      requested_action: 'send_external',
      status: 'needs_review',
      approval_required: true,
      approval_state: 'pending',
    })

    expect(
      resolveAgentRunPolicy({
        requestedAction: 'recap',
        risk: 'sovereign',
      }),
    ).toMatchObject({
      status: 'needs_review',
      approval_required: true,
    })
  })

  test('allows low-risk draft work without review', () => {
    expect(resolveAgentRunPolicy({ requestedAction: 'draft', risk: 'low' })).toMatchObject({
      status: 'queued',
      approval_required: false,
      approval_state: 'not_required',
    })
  })

  test('keeps recap and card actions behind explicit consent', () => {
    const defaultConsent = buildConsentSnapshot()
    expect(canStreamRecap(defaultConsent)).toBe(false)
    expect(canCreatePortableCard(defaultConsent)).toBe(false)

    const explicitConsent = buildConsentSnapshot({ recap: true, card: true, source: 'explicit' })
    expect(canStreamRecap(explicitConsent)).toBe(true)
    expect(canCreatePortableCard(explicitConsent)).toBe(true)
  })
})
