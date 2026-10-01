import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const ApprovalInput = z.object({
  id: z.string().uuid(),
  decision: z.enum(['approved', 'rejected', 'blocked']),
  reason: z.string().max(1000).optional().default(''),
})

export async function POST(request: NextRequest) {
  const parsed = ApprovalInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid approval decision', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: existing, error: readError } = await supabase
    .from('agent_runs')
    .select('id, evidence')
    .eq('id', parsed.data.id)
    .eq('actor_user_id', user.id)
    .single()

  if (readError) return NextResponse.json({ error: readError.message }, { status: 404 })

  const decidedAt = new Date().toISOString()
  const isApproved = parsed.data.decision === 'approved'
  const evidence = asRecord(existing.evidence)
  const { data, error } = await supabase
    .from('agent_runs')
    .update({
      approval_state: parsed.data.decision,
      status: isApproved ? 'approved' : 'blocked',
      approved_by: isApproved ? user.id : null,
      approved_at: isApproved ? decidedAt : null,
      blocked_reason: isApproved ? null : parsed.data.reason || parsed.data.decision,
      evidence: {
        ...evidence,
        approval_decision: {
          decision: parsed.data.decision,
          decided_by: user.id,
          decided_at: decidedAt,
          reason: parsed.data.reason || null,
        },
      },
    })
    .eq('id', parsed.data.id)
    .eq('actor_user_id', user.id)
    .select('id, status, approval_state, approved_at, blocked_reason')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ run: data })
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}
