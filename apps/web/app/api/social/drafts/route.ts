import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const SocialDraftInput = z.object({
  session_card_id: z.string().uuid().nullable().optional(),
  channel: z.enum([
    'x',
    'threads',
    'linkedin',
    'tiktok',
    'youtube',
    'farcaster',
    'bluesky',
    'other',
  ]),
  body: z.string().min(1).max(1800),
  scheduled_at: z.string().datetime().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  const parsed = SocialDraftInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid social draft', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase
    .from('social_drafts')
    .insert({
      user_id: user.id,
      session_card_id: parsed.data.session_card_id ?? null,
      channel: parsed.data.channel,
      body: parsed.data.body,
      scheduled_at: parsed.data.scheduled_at ?? null,
      metadata: parsed.data.metadata ?? {},
      status: 'needs_review',
      approval_required: true,
    })
    .select('id, channel, status, approval_required, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ draft: data })
}
