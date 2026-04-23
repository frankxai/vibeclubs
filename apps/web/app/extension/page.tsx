import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import {
  Badge,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  CodeBlock,
  Fader,
  Kbd,
  LinkButton,
  TimerDisplay,
} from '@/components/ui'
import { Reveal } from '@/components/motion'
import { VibeOrbDemo } from '@/components/three'

export const metadata = {
  title: 'Install the extension',
  description:
    'Overlay the mixer and timer on Meet, Discord, YouTube, or any tab. The Vibeclubs Chrome extension.',
}

export default function ExtensionPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="xl">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
            <Reveal direction="up">
              <div>
                <Eyebrow>Chrome extension</Eyebrow>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4 mb-5 leading-[1.02]">
                  Install the vibe.
                </h1>
                <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
                  Overlay the mixer and timer on Meet, Discord, YouTube, or any tab where
                  you&apos;re locking in. This is where the vibeclub actually happens.
                </p>
                <div className="flex flex-wrap gap-3 mb-12">
                  <LinkButton
                    href="https://chrome.google.com/webstore/detail/vibeclubs/placeholder"
                    variant="primary"
                    size="lg"
                    className="vc-shimmer-border"
                    external
                  >
                    Install from Chrome Web Store
                  </LinkButton>
                  <LinkButton
                    href="https://github.com/frankxai/vibeclubs/releases"
                    variant="outline"
                    size="lg"
                    external
                  >
                    Sideload latest
                  </LinkButton>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <Badge tone="signal" dot size="xs">
                    Manifest V3
                  </Badge>
                  <span className="text-white/30">·</span>
                  <span>MIT · React 18 · Plasmo</span>
                </div>
              </div>
            </Reveal>

            {/* Live preview of the overlay */}
            <Reveal direction="left" delay={0.15}>
              <OverlayPreview />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* THE VIBE, VISUALIZED — R3F signature moment */}
      <Section pad="lg" border>
        <Container width="xl">
          <Reveal>
            <div className="text-center mb-14">
              <Eyebrow className="inline-flex">The vibe, visualized</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 max-w-3xl mx-auto">
                Three layers. One sphere. Drag the faders.
              </h2>
              <p className="text-white/55 max-w-2xl mx-auto mt-5 text-lg leading-relaxed">
                A custom WebGL shader paints each fader as a color band on the orb. This is the
                same three-layer mix the extension runs — amber ambient, violet music, signal-green
                page audio — previewed here so you can feel the knobs before you install.
              </p>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <VibeOrbDemo className="mt-6" />
          </Reveal>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="xl">
          <Reveal>
            <div className="text-center mb-14">
              <Eyebrow className="inline-flex">What it adds</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
                Four things. Nothing else.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card pad="md" interactive>
              <CardEyebrow>Mixer</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Three faders.
              </CardTitle>
              <CardBody>
                Ambient + AI music + your tab. Independently controlled. Lives in your ears, not
                broadcast.
              </CardBody>
            </Card>
            <Card pad="md" interactive>
              <CardEyebrow>Rhythm</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Synced pomodoro.
              </CardTitle>
              <CardBody>
                Everyone on the extension in the same vibeclub hits the same block. Supabase
                Realtime broadcast. No polling, no drift.
              </CardBody>
            </Card>
            <Card pad="md" interactive>
              <CardEyebrow>Recap</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Auto-notes.
              </CardTitle>
              <CardBody>
                Session ends, Claude writes a two-liner, card lands on your profile. Shareable to
                X.
              </CardBody>
            </Card>
            <Card pad="md" interactive>
              <CardEyebrow>Anywhere</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Any page, any time.
              </CardTitle>
              <CardBody>
                Meet, Discord, Zoom, Figma, GitHub, blank tab. Anywhere you&apos;re making
                something.
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <Eyebrow>Privacy — the short version</Eyebrow>
              <h2 className="text-3xl font-bold tracking-tight mt-4 mb-5">
                Never reads page content. Ever.
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Audio mixing is 100% local via Web Audio. The only data that leaves your browser:
                the pomodoro broadcast (club slug + timer state) and a session summary (duration +
                cycle count).
              </p>
              <p className="text-white/50 leading-relaxed">
                Open source so you can verify —{' '}
                <a
                  href="https://github.com/frankxai/vibeclubs/tree/main/apps/extension"
                  className="text-amber-300 hover:underline"
                >
                  read the source
                </a>
                .
              </p>
            </div>
            <div>
              <Eyebrow>Keyboard</Eyebrow>
              <h2 className="text-3xl font-bold tracking-tight mt-4 mb-5">Shortcuts on any page.</h2>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-3">
                  <Kbd>⌘</Kbd>
                  <Kbd>J</Kbd>
                  <span className="text-white/40">·</span>
                  <span>Show / hide overlay</span>
                </li>
                <li className="flex items-center gap-3">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                  <span className="text-white/40">·</span>
                  <span>Start / pause pomodoro</span>
                </li>
                <li className="flex items-center gap-3">
                  <Kbd>⌘</Kbd>
                  <Kbd>⇧</Kbd>
                  <Kbd>M</Kbd>
                  <span className="text-white/40">·</span>
                  <span>Mute all layers</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="xl">
          <Eyebrow>Fork it</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-5">
            MIT, Plasmo, zero lock-in.
          </h2>
          <p className="text-white/60 leading-relaxed mb-8 max-w-2xl">
            The mixer, the pomodoro sync, the recap — all extracted into npm packages so you can
            drop them into your own product. Or fork the whole extension.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <CodeBlock
              caption="clone + dev"
              code={`git clone https://github.com/frankxai/vibeclubs
cd vibeclubs
pnpm install
pnpm dev:extension`}
            />
            <CodeBlock
              caption="embed the mixer"
              lang="ts"
              code={`import { createMixer } from '@vibeclubs/vibe-mix'
const mixer = createMixer()
await mixer.loadAmbient('lofi')
mixer.setLevel('ambient', 0.4)`}
            />
          </div>
          <div className="mt-8">
            <LinkButton href="/developers" variant="outline" size="md">
              All five packages →
            </LinkButton>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

function OverlayPreview() {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e0e16] to-[#1a1025] p-6 shadow-2xl shadow-amber-500/10">
        <div className="flex items-center gap-2 mb-5">
          <span className="live-dot" />
          <span className="text-xs font-mono text-white/60">#lofi-coders</span>
          <span className="ml-auto text-xs text-white/40 font-mono">overlay preview</span>
        </div>

        <div className="text-center mb-2">
          <TimerDisplay mmss="32:14" phase="focus" size="lg" />
        </div>
        <div className="text-center text-[11px] uppercase tracking-[0.18em] text-white/40 mb-6">
          focus · cycle 2
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition">
            Pause
          </button>
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition">
            Skip
          </button>
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition">
            End
          </button>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5">
          <Fader label="Ambient" defaultValue={35} accent="amber" />
          <Fader label="Music" defaultValue={25} accent="violet" />
          <Fader label="Page" defaultValue={85} accent="signal" />
        </div>
      </div>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-white/30 font-mono">
        renders on any tab
      </div>
    </div>
  )
}
