import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasHostedConfig } from '@/lib/hosted-config'

const ClubInput = z.object({
  name: z.string().min(3).max(80),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Slug must be lowercase alphanumeric + hyphens'),
  description: z.string().max(500).optional().default(''),
  type: z.enum(['coding', 'music', 'design', 'study', 'fitness', 'writing', 'other']),
  platform: z.enum(['meet', 'discord', 'zoom', 'in_person', 'other']),
  platform_url: z.string().url().optional().or(z.literal('')),
  schedule: z.string().max(120).optional().default(''),
  pomodoro_preset: z.enum([
    '25_5',
    '50_10',
    '90_20',
    'custom',
    'vibe_coding_sprint',
    'music_jam',
    'dance_break',
    'lightning',
  ]),
  ambient_preset: z.string().max(30).default('lofi'),
})

export async function POST(request: NextRequest) {
  if (!hasHostedConfig()) {
    return NextResponse.json(
      {
        error: 'Account-backed hosting is not configured yet.',
        code: 'hosted_not_configured',
      },
      { status: 503 },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = ClubInput.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Sign in first.', signin: '/signin?next=/start' },
      { status: 401 },
    )
  }

  const { data, error } = await supabase
    .rpc('create_club_with_owner', {
      p_name: parsed.data.name,
      p_slug: parsed.data.slug,
      p_description: parsed.data.description,
      p_type: parsed.data.type,
      p_platform: parsed.data.platform,
      p_platform_url: parsed.data.platform_url || null,
      p_schedule: parsed.data.schedule || null,
      p_pomodoro_preset: parsed.data.pomodoro_preset,
      p_ambient_preset: parsed.data.ambient_preset,
    })
    .single()

  if (error) {
    const status = error.code === '23505' ? 409 : 500
    return NextResponse.json({ error: error.message }, { status })
  }

  return NextResponse.json({ slug: data.slug })
}
