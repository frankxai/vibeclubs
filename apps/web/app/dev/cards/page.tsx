import { renderSessionCardSVG, type SessionCardData } from '@vibeclubs/session-card'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Section, Eyebrow, PageHeader } from '@/components/layout/container'

export const metadata = {
  title: 'Session card preview · /dev',
  description: 'Visual regression test page for the session-card SVG renderer.',
  robots: { index: false, follow: false },
}

const SAMPLES: Array<SessionCardData & { caption: string }> = [
  {
    caption: 'Reference vibeclub · 90 / 3 / Discord',
    clubName: 'lofi-coders-amsterdam',
    handle: '@frankx',
    durationMinutes: 90,
    pomodoroCycles: 3,
    platform: 'discord',
    date: '2026-04-21',
    ambientPreset: 'lofi',
  },
  {
    caption: 'Long lock-in · 100 / 2 / Meet',
    clubName: 'morning-writers',
    handle: '@lex',
    durationMinutes: 100,
    pomodoroCycles: 2,
    platform: 'meet',
    date: '2026-04-19',
  },
  {
    caption: 'Lightning · 60 / 5 / Discord',
    clubName: 'vibe-coding-sprint-thursdays',
    handle: '@nina',
    durationMinutes: 60,
    pomodoroCycles: 5,
    platform: 'discord',
    date: '2026-04-23',
  },
  {
    caption: 'Music jam · 90 / 1 / Zoom',
    clubName: 'suno-producers-global',
    handle: '@mox',
    durationMinutes: 90,
    pomodoroCycles: 1,
    platform: 'zoom',
    date: '2026-04-25',
  },
  {
    caption: 'IRL retreat · 120 / 4',
    clubName: 'founder-deepwork-tuesdays',
    handle: '@yuki',
    durationMinutes: 120,
    pomodoroCycles: 4,
    platform: 'in_person',
    date: '2026-04-22',
  },
  {
    caption: 'Edge · 25 / 1 / Other',
    clubName: 'first-time-host',
    handle: '@new',
    durationMinutes: 25,
    pomodoroCycles: 1,
    platform: 'other',
    date: '2026-04-20',
  },
  {
    caption: 'Edge · long club name truncation',
    clubName: 'extremely-long-club-name-that-might-overflow',
    handle: '@longhandle',
    durationMinutes: 50,
    pomodoroCycles: 2,
    platform: 'meet',
    date: '2026-04-18',
  },
  {
    caption: 'Edge · ampersand & quotes "in" name',
    clubName: 'r&d "lock-in"',
    handle: '@quote',
    durationMinutes: 75,
    pomodoroCycles: 3,
    platform: 'discord',
    date: '2026-04-17',
  },
]

export default function CardsDevPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="2xl">
          <PageHeader
            eyebrow={<Eyebrow tone="violet">/dev</Eyebrow>}
            title={<>Session card · visual regression</>}
            subtitle={
              <>
                Eight sample data shapes rendered via{' '}
                <code className="text-amber-300">renderSessionCardSVG()</code>. Use this page before
                merging changes to <code className="text-amber-300">@vibeclubs/session-card</code>.
                Cards are 1200×630 — same dimensions as Twitter / OG cards.
              </>
            }
          />
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {SAMPLES.map((sample) => {
              const svg = renderSessionCardSVG(sample)
                .replace(/<\?xml[^?]*\?>/, '')
                .replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')
              return (
                <figure
                  key={sample.caption}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  <div className="bg-black" dangerouslySetInnerHTML={{ __html: svg }} />
                  <figcaption className="px-5 py-3 text-xs text-white/50 font-mono border-t border-white/5">
                    {sample.caption}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
