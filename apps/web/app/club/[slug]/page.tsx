import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { ShareButton } from '@/components/share-button'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Fact } from '@/components/patterns/stat-block'
import { PulseBeat } from '@/components/motion'
import { Reveal } from '@/components/motion'
import {
  Badge,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  LinkButton,
  PlatformPill,
  TypePill,
} from '@/components/ui'
import { bpmForPreset } from '@vibeclubs/pomodoro-sync'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { findStaticClub } from '@/lib/clubs/content'
import type {
  ClubPlatform,
  ClubType,
  PomodoroPreset,
  SessionRow,
  ToolRecommendationRow,
} from '@/lib/supabase/types'

interface Params {
  params: Promise<{ slug: string }>
}

/**
 * Unified club shape. Both static (OSS markdown) and hosted (Supabase) clubs
 * get normalized to this so the render doesn't branch per source.
 */
interface Club {
  slug: string
  name: string
  description: string
  type: ClubType
  platform: ClubPlatform
  platform_url: string | null
  pomodoro_preset: PomodoroPreset
  ambient_preset: string
  schedule: string
  featured: boolean
  host: string | null
  source: 'static' | 'supabase'
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'
  return {
    title: slug,
    openGraph: {
      images: [`${site}/api/og?slug=${encodeURIComponent(slug)}`],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${site}/api/og?slug=${encodeURIComponent(slug)}`],
    },
  }
}

export default async function ClubPage({ params }: Params) {
  const { slug } = await params
  const { club, sessions, tools } = await loadClub(slug)
  if (!club) notFound()

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'
  const clubUrl = `${site}/club/${club.slug}`
  const bpm = bpmForPreset(club.pomodoro_preset)

  // JSON-LD for rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: club.name,
    description: club.description ?? `A ${club.type} vibeclub on ${club.platform}`,
    eventStatus: 'EventScheduled',
    eventAttendanceMode: 'OnlineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: 'Vibeclubs',
      url: site,
    },
    url: clubUrl,
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section pad="md" className="pt-28">
        <Container width="lg" as="article">
          <Reveal direction="up">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <TypePill type={club.type} />
                  <PlatformPill platform={club.platform} />
                  {club.featured && (
                    <Badge tone="amber" size="xs">
                      Featured
                    </Badge>
                  )}
                  {club.source === 'static' && (
                    <Badge tone="outline" size="xs">
                      OSS listing
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-mono text-white/40 ml-2">
                    <PulseBeat bpm={bpm} size={8} tone="signal" />
                    {bpm} bpm
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.02]">
                  {club.name}
                </h1>
                <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{club.description}</p>
                {club.host && (
                  <p className="mt-4 text-sm text-white/45 font-mono">Hosted by {club.host}</p>
                )}
              </div>
              <JoinButton club={club} />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-3 mt-12">
            <Fact label="Rhythm" value={prettyPreset(club.pomodoro_preset)} />
            <Fact label="When" value={club.schedule || 'Whenever the link is live'} />
            <Fact label="Soundtrack" value={capitalize(club.ambient_preset)} />
          </div>

          <div className="mt-10">
            <Eyebrow className="mb-3">Tell your crew</Eyebrow>
            <ShareButton clubName={club.name} clubUrl={clubUrl} schedule={club.schedule} />
          </div>

          {tools.length > 0 && (
            <section className="mt-16">
              <Eyebrow className="mb-4">The stack this crew uses</Eyebrow>
              <div className="grid sm:grid-cols-2 gap-3">
                {tools.map((t) => (
                  <a
                    key={t.id}
                    href={t.affiliate_url ?? t.tool_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-2xl p-4 border border-white/10 bg-white/[0.02] hover:border-amber-500/30 transition block"
                  >
                    <div className="font-medium mb-1">{t.tool_name}</div>
                    <div className="text-xs text-white/50">{t.description}</div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {sessions.length > 0 && (
            <section className="mt-16">
              <Eyebrow className="mb-4">Recent sessions</Eyebrow>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm flex items-center justify-between"
                  >
                    <span>{new Date(s.started_at).toLocaleString()}</span>
                    <span className="text-white/50 font-mono text-xs">
                      {s.focus_minutes}m · {s.pomodoro_cycles} cycles
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Card pad="lg" className="mt-16">
            <CardEyebrow>Show up</CardEyebrow>
            <CardTitle className="mb-5">Three steps when the link goes live.</CardTitle>
            <ol className="space-y-4 text-white/70 text-sm leading-relaxed">
              <li className="flex gap-4">
                <span className="font-mono text-xs text-amber-400 pt-1 w-6">01</span>
                <span>Hit the platform link above when the session starts.</span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-xs text-amber-400 pt-1 w-6">02</span>
                <span>
                  Open the{' '}
                  <Link href="/extension" className="text-amber-300 hover:underline">
                    Vibeclubs extension
                  </Link>
                  . Enter the slug <code className="text-amber-300">{club.slug}</code>.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-xs text-amber-400 pt-1 w-6">03</span>
                <span>
                  Click start. Everyone in the club on the extension hits the same pomodoro at{' '}
                  {bpm} BPM. Recap lands on your profile when you&apos;re done.
                </span>
              </li>
            </ol>
            <CardBody className="mt-6">
              <LinkButton href="/extension" variant="outline" size="md">
                Install the extension →
              </LinkButton>
            </CardBody>
          </Card>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

function JoinButton({ club }: { club: Club }) {
  if (!club.platform_url) {
    return (
      <button
        type="button"
        disabled
        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/40 text-sm"
      >
        No link yet
      </button>
    )
  }
  return (
    <LinkButton
      href={club.platform_url}
      variant="primary"
      size="lg"
      className="vc-shimmer-border"
      external
    >
      Join →
    </LinkButton>
  )
}

function prettyPreset(p: PomodoroPreset) {
  switch (p) {
    case '25_5':
      return '25 / 5'
    case '50_10':
      return '50 / 10'
    case '90_20':
      return '90 / 20'
    case 'vibe_coding_sprint':
      return 'Sprint · 22 / 3 ship × 3 + 15 break'
    case 'music_jam':
      return 'Music jam · 45 + 5 dance + 40 + ship'
    case 'dance_break':
      return 'Dance break · 25 / 5'
    case 'lightning':
      return 'Lightning · 10 / 2 ship × 5'
    default:
      return 'Custom'
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

async function loadClub(slug: string): Promise<{
  club: Club | null
  sessions: SessionRow[]
  tools: ToolRecommendationRow[]
}> {
  // Static (OSS) path wins first — zero-backend clubs are canonical.
  const staticClub = findStaticClub(slug)
  if (staticClub) {
    return {
      club: {
        slug: staticClub.slug,
        name: staticClub.name,
        description: staticClub.description,
        type: staticClub.type,
        platform: staticClub.platform,
        platform_url: staticClub.platform_url ?? null,
        pomodoro_preset: staticClub.preset,
        ambient_preset: staticClub.ambient,
        schedule: staticClub.schedule,
        featured: staticClub.featured ?? false,
        host: staticClub.host,
        source: 'static',
      },
      sessions: [],
      tools: [],
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { club: null, sessions: [], tools: [] }
  }
  try {
    const supabase = await createSupabaseServerClient()
    const { data: row } = await supabase
      .from('clubs')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (!row) return { club: null, sessions: [], tools: [] }
    const [{ data: sessions }, { data: tools }] = await Promise.all([
      supabase
        .from('sessions')
        .select('*')
        .eq('club_id', row.id)
        .order('started_at', { ascending: false })
        .limit(10),
      supabase
        .from('tool_recommendations')
        .select('*')
        .eq('club_type', row.type)
        .limit(6),
    ])
    return {
      club: {
        slug: row.slug,
        name: row.name,
        description: row.description ?? '',
        type: row.type,
        platform: row.platform,
        platform_url: row.platform_url,
        pomodoro_preset: row.pomodoro_preset,
        ambient_preset: row.ambient_preset,
        schedule: row.schedule ?? '',
        featured: row.tier === 'featured',
        host: null,
        source: 'supabase',
      },
      sessions: (sessions ?? []) as SessionRow[],
      tools: (tools ?? []) as ToolRecommendationRow[],
    }
  } catch {
    return { club: null, sessions: [], tools: [] }
  }
}
