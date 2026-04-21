import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Card, CardBody, CardEyebrow, CardTitle, CodeBlock, LinkButton } from '@/components/ui'

export const metadata = {
  title: 'Developers',
  description:
    'Five MIT-licensed npm packages — vibe-mix, pomodoro-sync, ai-witness, session-card, suno-bridge.',
}

const PACKAGES: { name: string; desc: string; entry: string }[] = [
  {
    name: '@vibeclubs/vibe-mix',
    desc: 'Three-layer Web Audio mixer. Ambient + music + page. Framework-agnostic, equal-power faders, duck-on-voice.',
    entry: "import { createMixer } from '@vibeclubs/vibe-mix'",
  },
  {
    name: '@vibeclubs/pomodoro-sync',
    desc: 'Pomodoro state machine + Supabase Realtime broadcast. Late-joiner ping/pong. No drift.',
    entry: "import { createPomodoro } from '@vibeclubs/pomodoro-sync'",
  },
  {
    name: '@vibeclubs/ai-witness',
    desc: 'Claude prompt builder for session recaps. Hard-enforces "never interrupt" in the system prompt.',
    entry: "import { witnessPrompt } from '@vibeclubs/ai-witness'",
  },
  {
    name: '@vibeclubs/session-card',
    desc: 'SVG session card renderer. 1200×630. Deterministic from session data. Brand-locked.',
    entry: "import { renderSessionCardSVG } from '@vibeclubs/session-card'",
  },
  {
    name: '@vibeclubs/suno-bridge',
    desc: 'Suno API wrapper with royalty-free fallback. Prompt helper reads club genre + time of day.',
    entry: "import { generateMusic } from '@vibeclubs/suno-bridge'",
  },
]

export default function DevelopersPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="xl">
          <Eyebrow>Developers</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4 mb-5 leading-[1.02]">
            Fork the vibe.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-12">
            Every capability in the extension ships as a framework-agnostic npm package. MIT. Drop
            them into Electron, Raycast, Tauri, your own site. Nothing requires vibeclubs.ai.
          </p>
        </Container>
      </Section>

      <Section pad="sm">
        <Container width="xl">
          <div className="grid md:grid-cols-2 gap-4">
            {PACKAGES.map((p) => (
              <Card key={p.name} pad="lg" interactive>
                <CardEyebrow className="font-mono text-amber-300">{p.name}</CardEyebrow>
                <CardBody className="mb-5 text-white/70 leading-relaxed">{p.desc}</CardBody>
                <div className="rounded-xl bg-black/40 border border-white/5 px-3 py-2 font-mono text-xs text-white/60 mb-4 overflow-x-auto">
                  {p.entry}
                </div>
                <a
                  href={`https://www.npmjs.com/package/${p.name}`}
                  className="text-xs font-mono text-white/40 hover:text-amber-300 transition"
                >
                  npm →
                </a>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <Eyebrow>Quickstart</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-5">
                Three lines. Running mixer.
              </h2>
              <p className="text-white/60 leading-relaxed mb-5">
                Any framework, any runtime. The packages use `import` maps instead of framework
                plugins, so they drop into anything — including Chrome extensions and Node.
              </p>
              <LinkButton
                href="https://github.com/frankxai/vibeclubs"
                variant="outline"
                size="md"
                external
              >
                Read the source →
              </LinkButton>
            </div>
            <CodeBlock
              caption="quickstart.ts"
              lang="ts"
              code={`pnpm add @vibeclubs/vibe-mix @vibeclubs/pomodoro-sync

import { createMixer } from '@vibeclubs/vibe-mix'
import { createPomodoro } from '@vibeclubs/pomodoro-sync'

const mixer = createMixer()
await mixer.loadAmbient('lofi')
mixer.setLevel('ambient', 0.4)

const pomo = createPomodoro({
  clubId: 'lofi-coders',
  preset: '50_10',
})
pomo.start()
pomo.on('complete', (cycle) => console.log('shipped', cycle))`}
            />
          </div>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card pad="lg">
              <CardEyebrow>Contribute</CardEyebrow>
              <CardTitle as="h2" className="mb-4">
                Help ship the format.
              </CardTitle>
              <CardBody>
                Read{' '}
                <Link
                  href="https://github.com/frankxai/vibeclubs/blob/main/CONTRIBUTING.md"
                  className="text-amber-300 hover:underline"
                >
                  CONTRIBUTING.md
                </Link>{' '}
                for style + the vetoes (no breakout rooms, no host controls, no recording-by-default,
                no calendar features — these are load-bearing).
              </CardBody>
              <div className="mt-5">
                <LinkButton
                  href="https://github.com/frankxai/vibeclubs/labels/good-first-issue"
                  variant="outline"
                  size="sm"
                  external
                >
                  good-first-issue →
                </LinkButton>
              </div>
            </Card>
            <Card pad="lg" tone="featured">
              <CardEyebrow>Why open source</CardEyebrow>
              <CardTitle as="h2" className="mb-4">
                A format has to move.
              </CardTitle>
              <CardBody>
                If the mixer, the sync, and the recap live behind a paywall, they never travel. MIT
                is the only license that lets the vibeclub format spread into Electron apps, Raycast
                extensions, ops dashboards, and tools nobody&apos;s built yet.
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
