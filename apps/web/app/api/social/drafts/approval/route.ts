import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const DraftApprovalInput = z.object({
  id: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  reason: z.string().max(1000).optional().default(''),
})

export async function POST(request: NextRequest) {
  const parsed = DraftApprovalInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid draft decision', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: existing, error: readError } = await supabase
    .from('social_drafts')
    .select('id, metadata')
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .single()

  if (readError) return NextResponse.json({ error: readError.message }, { status: 404 })

  const metadata = asRecord(existing.metadata)
  const { data, error } = await supabase
    .from('social_drafts')
    .update({
      status: parsed.data.decision,
      approval_required: false,
      metadata: {
        ...metadata,
        approval_decision: {
          decision: parsed.data.decision,
          decided_by: user.id,
          decided_at: new Date().toISOString(),
          reason: parsed.data.reason || null,
        },
      },
    })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .select('id, channel, status, approval_required, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ draft: data })
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}
