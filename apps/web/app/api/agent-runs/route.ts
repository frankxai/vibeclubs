import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { resolveAgentRunPolicy } from '@/lib/agents/policy'
import { buildAgentJobEnvelope, evaluateAgentRunReadiness } from '@/lib/agents/runtime'

const AgentRunInput = z.object({
  agent: z.string().min(2).max(80),
  lane: z.string().min(2).max(80),
  scope: z.string().min(2).max(80),
  requested_action: z
    .enum([
      'draft',
      'recap',
      'card',
      'social_draft',
      'send_external',
      'moderation',
      'billing',
      'export',
      'delete',
      'admin_write',
    ])
    .default('draft'),
  scope_id: z.string().uuid().nullable().optional(),
  status: z
    .enum([
      'draft',
      'queued',
      'running',
      'needs_review',
      'approved',
      'blocked',
      'failed',
      'completed',
    ])
    .optional(),
  risk: z.enum(['low', 'normal', 'high', 'sovereign']).default('normal'),
  input_summary: z.string().max(2000).nullable().optional(),
  output_summary: z.string().max(4000).nullable().optional(),
  evidence: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  const parsed = AgentRunInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid agent run', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const policy = resolveAgentRunPolicy({
    requestedAction: parsed.data.requested_action,
    risk: parsed.data.risk,
    status: parsed.data.status,
    evidence: parsed.data.evidence ?? {},
  })
  const queuedAt = new Date().toISOString()
  const queue = buildAgentJobEnvelope({
    lane: parsed.data.lane,
    requestedAction: policy.requested_action,
    scope: parsed.data.scope,
    scopeId: parsed.data.scope_id ?? null,
    risk: parsed.data.risk,
    createdAt: queuedAt,
  })
  const readiness = evaluateAgentRunReadiness({
    scope: parsed.data.scope,
    requestedAction: policy.requested_action,
    risk: parsed.data.risk,
    approvalRequired: policy.approval_required,
    evidence: parsed.data.evidence ?? {},
  })

  const { data, error } = await supabase
    .from('agent_runs')
    .insert({
      ...parsed.data,
      requested_action: policy.requested_action,
      status: policy.status,
      approval_required: policy.approval_required,
      approval_state: policy.approval_state,
      actor_user_id: user.id,
      scope_id: parsed.data.scope_id ?? null,
      input_summary: parsed.data.input_summary ?? null,
      output_summary: parsed.data.output_summary ?? null,
      evidence: {
        ...policy.evidence,
        queue,
        readiness_eval: readiness,
      },
    })
    .select('id, status, risk, requested_action, approval_required, approval_state, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ run: data })
}
