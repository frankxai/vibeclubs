import type { AgentRunRisk, AgentRunStatus } from '@/lib/supabase/types'

export const CONSENT_VERSION = 'vibeclubs.consent.v1'

export type AgentRequestedAction =
  | 'draft'
  | 'recap'
  | 'card'
  | 'social_draft'
  | 'send_external'
  | 'moderation'
  | 'billing'
  | 'export'
  | 'delete'
  | 'admin_write'

export type AgentApprovalState = 'not_required' | 'pending' | 'approved' | 'rejected' | 'blocked'

export interface ConsentSnapshot {
  version: typeof CONSENT_VERSION
  witness: boolean
  recap: boolean
  card: boolean
  social: boolean
  source: 'explicit' | 'legacy' | 'default'
  captured_at: string
}

export interface AgentRunPolicy {
  requested_action: AgentRequestedAction
  status: AgentRunStatus
  approval_required: boolean
  approval_state: AgentApprovalState
  evidence: Record<string, unknown>
}

const REVIEW_ACTIONS = new Set<AgentRequestedAction>([
  'send_external',
  'moderation',
  'billing',
  'export',
  'delete',
  'admin_write',
])

export function buildConsentSnapshot(input?: {
  witness?: boolean
  recap?: boolean
  card?: boolean
  social?: boolean
  source?: ConsentSnapshot['source']
  captured_at?: string
}): ConsentSnapshot {
  return {
    version: CONSENT_VERSION,
    witness: input?.witness ?? false,
    recap: input?.recap ?? false,
    card: input?.card ?? false,
    social: input?.social ?? false,
    source: input?.source ?? 'default',
    captured_at: input?.captured_at ?? new Date().toISOString(),
  }
}

export function resolveAgentRunPolicy(input: {
  requestedAction?: AgentRequestedAction
  risk: AgentRunRisk
  status?: AgentRunStatus
  evidence?: Record<string, unknown>
}): AgentRunPolicy {
  const requestedAction = input.requestedAction ?? 'draft'
  const needsReview =
    input.risk === 'high' || input.risk === 'sovereign' || REVIEW_ACTIONS.has(requestedAction)

  const status = needsReview
    ? input.status === 'blocked' || input.status === 'failed'
      ? input.status
      : 'needs_review'
    : (input.status ?? 'queued')

  return {
    requested_action: requestedAction,
    status,
    approval_required: needsReview,
    approval_state: needsReview ? 'pending' : 'not_required',
    evidence: {
      ...input.evidence,
      guardrail: {
        approval_required: needsReview,
        requested_action: requestedAction,
        risk: input.risk,
      },
    },
  }
}

export function canCreatePortableCard(consent: ConsentSnapshot): boolean {
  return consent.card === true
}

export function canStreamRecap(consent: ConsentSnapshot): boolean {
  return consent.recap === true
}
