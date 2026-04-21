import { ImageResponse } from 'next/og'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Dynamic OG image generator.
 *
 *   GET /api/og                  → default brand card
 *   GET /api/og?slug=club-slug   → club-specific card (name + rhythm + platform)
 *   GET /api/og?title=X&sub=Y    → custom card for arbitrary pages
 *
 * Rendered via next/og ImageResponse — 1200×630, brand-locked gradient.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  let title = url.searchParams.get('title') ?? 'Host a vibeclub.'
  let subtitle =
    url.searchParams.get('sub') ??
    'Claude Code + your crew + a soundtrack. Ship the thing.'
  let rhythm = ''

  if (slug && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createSupabaseServerClient()
      const { data } = await supabase
        .from('clubs')
        .select('name, description, pomodoro_preset, platform, schedule')
        .eq('slug', slug)
        .maybeSingle()
      if (data) {
        title = data.name
        subtitle = data.description ?? `Vibeclub on ${data.platform}`
        rhythm = prettyPreset(data.pomodoro_preset as string)
      }
    } catch {
      // fall through to defaults
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #0a0a0f 0%, #1a1025 60%, #2a1435 100%)',
          padding: 72,
          fontFamily: 'Inter, system-ui, sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#f59e0b',
            }}
          />
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.2 }}>
            Vibeclubs
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -2,
              color: 'white',
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 28, color: 'rgba(255,255,255,0.5)', fontSize: 20 }}>
            {rhythm && <span>{rhythm}</span>}
            <span>·</span>
            <span>MIT</span>
            <span>·</span>
            <span>open source</span>
          </div>
          <div style={{ fontSize: 20, color: '#f59e0b', fontWeight: 600 }}>
            vibeclubs.ai
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

function prettyPreset(p: string): string {
  switch (p) {
    case '25_5':
      return '25 / 5'
    case '50_10':
      return '50 / 10'
    case '90_20':
      return '90 / 20'
    default:
      return 'Custom rhythm'
  }
}
