import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const ReportInput = z.object({
  subject_type: z.enum(['club', 'session', 'card', 'profile', 'other']),
  subject_id: z.string().uuid().nullable().optional(),
  reason: z.enum(['spam', 'abuse', 'privacy', 'safety', 'ip', 'other']),
  details: z.string().max(1200).nullable().optional(),
})

export async function POST(request: NextRequest) {
  const parsed = ReportInput.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid report', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data, error } = await supabase
    .from('reports')
    .insert({
      ...parsed.data,
      subject_id: parsed.data.subject_id ?? null,
      details: parsed.data.details ?? null,
      reporter_id: user.id,
    })
    .select('id, status, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ report: data })
}
