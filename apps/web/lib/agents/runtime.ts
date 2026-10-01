import type { AgentRunRisk } from '@/lib/supabase/types'
import type { AgentRequestedAction } from './policy'

export type AgentLane = 'guardian' | 'witness' | 'growth' | 'builder' | 'queen'

export interface AgentJobEnvelope {
  schema: 'vibeclubs.agent_job.v1'
  idempotency_key: string
  lane: AgentLane | string
  requested_action: AgentRequestedAction
  scope: string
  scope_id: string | null
  risk: AgentRunRisk
  attempts: number
  not_before: string
}

export interface AgentReadinessEval {
  schema: 'vibeclubs.agent_eval.v1'
  score: number
  passed: boolean
  checks: {
    hasScope: boolean
    hasAction: boolean
    hasEvidence: boolean
    reviewGateAligned: boolean
  }
  notes: string[]
}

const REVIEW_ACTIONS = new Set<AgentRequestedAction>([
  'send_external',
  'moderation',
  'billing',
  'export',
  'delete',
  'admin_write',
])

export function buildAgentJobEnvelope(input: {
  lane: string
  requestedAction: AgentRequestedAction
  scope: string
  scopeId?: string | null
  risk: AgentRunRisk
  createdAt?: string
}): AgentJobEnvelope {
  const notBefore = input.createdAt ?? new Date().toISOString()
  return {
    schema: 'vibeclubs.agent_job.v1',
    idempotency_key: [
      normalizeKey(input.lane),
      normalizeKey(input.requestedAction),
      normalizeKey(input.scope),
      input.scopeId ?? 'global',
      notBefore.slice(0, 16),
    ].join(':'),
    lane: input.lane,
    requested_action: input.requestedAction,
    scope: input.scope,
    scope_id: input.scopeId ?? null,
    risk: input.risk,
    attempts: 0,
    not_before: notBefore,
  }
}

export function evaluateAgentRunReadiness(input: {
  scope: string
  requestedAction: AgentRequestedAction
  risk: AgentRunRisk
  approvalRequired: boolean
  evidence: Record<string, unknown>
}): AgentReadinessEval {
  const reviewRequired =
    input.risk === 'high' || input.risk === 'sovereign' || REVIEW_ACTIONS.has(input.requestedAction)
  const checks = {
    hasScope: input.scope.trim().length > 0,
    hasAction: input.requestedAction.trim().length > 0,
    hasEvidence: Object.keys(input.evidence).length > 0,
    reviewGateAligned: reviewRequired === input.approvalRequired,
  }
  const notes = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([key]) => `Failed ${key}`)
  const passedCount = Object.values(checks).filter(Boolean).length
  const score = Math.round((passedCount / Object.keys(checks).length) * 100)
  return {
    schema: 'vibeclubs.agent_eval.v1',
    score,
    passed: score === 100,
    checks,
    notes,
  }
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
