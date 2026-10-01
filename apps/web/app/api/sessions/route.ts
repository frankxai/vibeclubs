import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { buildConsentSnapshot } from '@/lib/agents/policy'

const ConsentInput = z.object({
  witness: z.boolean().optional().default(false),
  recap: z.boolean().optional().default(false),
  card: z.boolean().optional().default(false),
  social: z.boolean().optional().default(false),
})

const SessionInput = z.object({
  club_id: z.string().uuid().nullable().optional(),
  platform_used: z.enum(['meet', 'discord', 'zoom', 'in_person', 'other']).nullable().optional(),
  started_at: z.string().datetime().optional(),
  ended_at: z.string().datetime().optional(),
  focus_minutes: z.number().int().min(0).max(1440),
  break_minutes: z.number().int().min(0).max(1440),
  pomodoro_cycles: z.number().int().min(0).max(100),
  session_card_url: z.string().url().nullable().optional(),
  consent: ConsentInput.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  const parsed = SessionInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const consent = buildConsentSnapshot({
    ...(parsed.data.consent ?? {}),
    source: parsed.data.consent ? 'explicit' : parsed.data.session_card_url ? 'legacy' : 'default',
  })
  const sessionInput = {
    club_id: parsed.data.club_id,
    platform_used: parsed.data.platform_used,
    started_at: parsed.data.started_at,
    ended_at: parsed.data.ended_at,
    focus_minutes: parsed.data.focus_minutes,
    break_minutes: parsed.data.break_minutes,
    pomodoro_cycles: parsed.data.pomodoro_cycles,
    session_card_url: parsed.data.session_card_url,
    metadata: parsed.data.metadata,
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...sessionInput, user_id: user.id })
    .select(
      'id, club_id, platform_used, started_at, focus_minutes, break_minutes, pomodoro_cycles, session_card_url',
    )
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const [{ error: participantError }, cardResult] = await Promise.all([
    supabase.from('session_participants').upsert(
      {
        session_id: data.id,
        user_id: user.id,
        focus_minutes: data.focus_minutes,
        witness_consent: consent.witness,
        recap_consent: consent.recap,
        card_consent: consent.card,
        social_consent: consent.social,
        consent_version: consent.version,
        metadata: { source: 'session_log', consent_source: consent.source },
      },
      { onConflict: 'session_id,user_id' },
    ),
    data.session_card_url
      ? supabase
          .from('session_cards')
          .insert({
            session_id: data.id,
            club_id: data.club_id,
            user_id: user.id,
            image_url: data.session_card_url,
            public_payload: {
              platform: data.platform_used,
              started_at: data.started_at,
              focus_minutes: data.focus_minutes,
              break_minutes: data.break_minutes,
              pomodoro_cycles: data.pomodoro_cycles,
            },
            attestation: {
              schema: 'vibeclubs.session_card.v1',
              source: 'api/sessions',
              created_by: user.id,
            },
            consent_snapshot: consent as unknown as Record<string, unknown>,
          })
          .select('id')
          .single()
      : Promise.resolve({ data: null, error: null }),
  ])

  if (participantError) {
    return NextResponse.json({ error: participantError.message }, { status: 500 })
  }
  if (cardResult.error) {
    return NextResponse.json({ error: cardResult.error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, card_id: cardResult.data?.id ?? null })
}
