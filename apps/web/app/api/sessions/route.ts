import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const SessionInput = z.object({
  club_id: z.string().uuid().nullable().optional(),
  platform_used: z.enum(['meet', 'discord', 'zoom', 'in_person', 'other']).nullable().optional(),
  started_at: z.string().datetime().optional(),
  ended_at: z.string().datetime().optional(),
  focus_minutes: z.number().int().min(0).max(1440),
  break_minutes: z.number().int().min(0).max(1440),
  pomodoro_cycles: z.number().int().min(0).max(100),
  session_card_url: z.string().url().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  const parsed = SessionInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...parsed.data, user_id: user.id })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
