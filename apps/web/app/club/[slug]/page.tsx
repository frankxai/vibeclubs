import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { ShareButton } from '@/components/share-button'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Fact } from '@/components/patterns/stat-block'
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
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ClubRow, SessionRow, ToolRecommendationRow } from '@/lib/supabase/types'

interface Params {
  params: Promise<{ slug: string }>
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

  // JSON-LD for rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: club.name,
    description: club.description ?? `A ${club.type} vibeclub on ${club.platform}`,
    eventStatus: club.is_active ? 'EventScheduled' : 'EventCancelled',
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
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <TypePill type={club.type} />
                <PlatformPill platform={club.platform} />
                {club.tier === 'featured' && (
                  <Badge tone="amber" size="xs">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.02]">
                {club.name}
              </h1>
              <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{club.description}</p>
            </div>
            <JoinButton club={club} />
          </div>

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
                  Click start. Everyone in the club on the extension hits the same pomodoro. Recap
                  lands on your profile when you&apos;re done.
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

function JoinButton({ club }: { club: ClubRow }) {
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
    <LinkButton href={club.platform_url} variant="primary" size="lg" external>
      Join →
    </LinkButton>
  )
}

function prettyPreset(p: ClubRow['pomodoro_preset']) {
  switch (p) {
    case '25_5':
      return '25 / 5'
    case '50_10':
      return '50 / 10'
    case '90_20':
      return '90 / 20'
    default:
      return 'Custom'
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

async function loadClub(slug: string): Promise<{
  club: ClubRow | null
  sessions: SessionRow[]
  tools: ToolRecommendationRow[]
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { club: null, sessions: [], tools: [] }
  }
  try {
    const supabase = await createSupabaseServerClient()
    const { data: club } = await supabase
      .from('clubs')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
    if (!club) return { club: null, sessions: [], tools: [] }
    const [{ data: sessions }, { data: tools }] = await Promise.all([
      supabase
        .from('sessions')
        .select('*')
        .eq('club_id', club.id)
        .order('started_at', { ascending: false })
        .limit(10),
      supabase
        .from('tool_recommendations')
        .select('*')
        .eq('club_type', club.type)
        .limit(6),
    ])
    return {
      club: club as ClubRow,
      sessions: (sessions ?? []) as SessionRow[],
      tools: (tools ?? []) as ToolRecommendationRow[],
    }
  } catch {
    return { club: null, sessions: [], tools: [] }
  }
}
