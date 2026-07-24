import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Card, CardBody, CardEyebrow, CardTitle, CodeBlock, LinkButton } from '@/components/ui'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { DevelopersNetworkLazy } from '@/components/three'

export const metadata = {
  title: 'Developer source',
  description: 'Five MIT-licensed workspace packages in source. npm publication is still pending.',
}

const PACKAGES: { name: string; path: string; desc: string; entry: string }[] = [
  {
    name: '@vibeclubs/vibe-mix',
    path: 'vibe-mix',
    desc: 'Three-layer Web Audio mixer. Ambient + music + page. Framework-agnostic, equal-power faders, duck-on-voice.',
    entry: "import { createMixer } from '@vibeclubs/vibe-mix'",
  },
  {
    name: '@vibeclubs/pomodoro-sync',
    path: 'pomodoro-sync',
    desc: 'Pomodoro state machine with optional Supabase Realtime binding when the caller supplies a client.',
    entry: "import { createPomodoro } from '@vibeclubs/pomodoro-sync'",
  },
  {
    name: '@vibeclubs/ai-witness',
    path: 'ai-witness',
    desc: 'Claude prompt builder for session recaps. Hard-enforces "never interrupt" in the system prompt.',
    entry: "import { witnessPrompt } from '@vibeclubs/ai-witness'",
  },
  {
    name: '@vibeclubs/session-card',
    path: 'session-card',
    desc: 'SVG session card renderer. 1200×630. Deterministic from session data. Brand-locked.',
    entry: "import { renderSessionCardSVG } from '@vibeclubs/session-card'",
  },
  {
    name: '@vibeclubs/suno-bridge',
    path: 'suno-bridge',
    desc: 'Suno API wrapper with a caller-supplied fallback. Prompt helper reads club genre + time of day.',
    entry: "import { generateMusic } from '@vibeclubs/suno-bridge'",
  },
]

export default function DevelopersPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="xl">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            <Reveal direction="up">
              <div>
                <Eyebrow>Developers</Eyebrow>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4 mb-5 leading-[1.02]">
                  Fork the source.
                </h1>
                <p className="text-xl text-white/60 max-w-2xl leading-relaxed mb-8">
                  Five capabilities live as framework-agnostic workspace packages in the public
                  repo. They are not published to npm yet. Clone the repo and work with them
                  locally.
                </p>
                <div className="flex items-center gap-3 text-xs font-mono text-white/45">
                  <span>{PACKAGES.length} workspace packages</span>
                  <span className="text-white/20">·</span>
                  <span>MIT</span>
                  <span className="text-white/20">·</span>
                  <span>npm release pending</span>
                </div>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.2}>
              <DevelopersNetworkLazy className="w-full aspect-square" />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section pad="sm">
        <Container width="xl">
          <Stagger gap={0.08}>
            <div className="grid md:grid-cols-2 gap-4">
              {PACKAGES.map((p) => (
                <StaggerItem key={p.name}>
                  <Card pad="lg" interactive className="h-full">
                    <CardEyebrow className="font-mono text-amber-300">{p.name}</CardEyebrow>
                    <CardBody className="mb-5 text-white/70 leading-relaxed">{p.desc}</CardBody>
                    <div className="rounded-xl bg-black/40 border border-white/5 px-3 py-2 font-mono text-xs text-white/60 mb-4 overflow-x-auto">
                      {p.entry}
                    </div>
                    <a
                      href={`https://github.com/frankxai/vibeclubs/tree/main/packages/${p.path}`}
                      className="text-xs font-mono text-white/40 hover:text-amber-300 transition"
                    >
                      source →
                    </a>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <Eyebrow>Quickstart</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-5">
                Clone it. Run locally.
              </h2>
              <p className="text-white/60 leading-relaxed mb-5">
                The repository is the public install path today. The package names exist in the
                workspace, but the registry releases do not.
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
              caption="local checkout"
              code={`git clone https://github.com/frankxai/vibeclubs
cd vibeclubs
pnpm install
pnpm --filter @vibeclubs/vibe-mix test`}
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
                for style + the vetoes (no breakout rooms, no host controls, no
                recording-by-default, no calendar features — these are load-bearing).
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
