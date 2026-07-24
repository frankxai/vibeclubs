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
  title: 'Extension source',
  description:
    'Inspect and build the Vibeclubs Chrome extension source before public distribution.',
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
                  Build the extension.
                </h1>
                <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
                  The source is public and buildable now. Chrome Web Store distribution,
                  account-backed timer sync, saved profiles, and hosted audio are not released yet.
                </p>
                <div className="flex flex-wrap gap-3 mb-12">
                  <LinkButton
                    href="https://github.com/frankxai/vibeclubs/blob/main/apps/extension/README.md"
                    variant="primary"
                    size="lg"
                    className="vc-shimmer-border"
                    external
                  >
                    Read the build steps
                  </LinkButton>
                  <LinkButton
                    href="https://github.com/frankxai/vibeclubs/tree/main/apps/extension"
                    variant="outline"
                    size="lg"
                    external
                  >
                    Inspect the source
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
                A custom WebGL shader paints each fader as a color band on the orb. This page
                previews the three mixer controls in the source; it does not prove public audio
                delivery.
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
              <Eyebrow className="inline-flex">What is in source</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
                Four inspectable parts.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card pad="md" interactive>
              <CardEyebrow>Mixer</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Local faders.
              </CardTitle>
              <CardBody>
                Web Audio controls for ambient, music, and page levels. The public audio files are
                not live yet.
              </CardBody>
            </Card>
            <Card pad="md" interactive>
              <CardEyebrow>Rhythm</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Timer engine.
              </CardTitle>
              <CardBody>
                The timer runs locally. A build can add Supabase Realtime settings; the public
                extension has no release receipt for cross-device sync.
              </CardBody>
            </Card>
            <Card pad="md" interactive>
              <CardEyebrow>Recap</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Optional recap.
              </CardTitle>
              <CardBody>
                After the disclosure and opt-in, the source can request a short Claude recap. Saving
                it to a profile is not wired.
              </CardBody>
            </Card>
            <Card pad="md" interactive>
              <CardEyebrow>Anywhere</CardEyebrow>
              <CardTitle as="h3" className="mb-2">
                Content script.
              </CardTitle>
              <CardBody>
                The current source matches HTTP and HTTPS pages. A store-reviewed build is not
                published.
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
                Audio mixing stays in Web Audio. The current extension stores its own settings
                locally. A recap request leaves the browser only after the disclosure and opt-in.
                Hosted timer sync and profile saving are not wired in the public build.
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
              <h2 className="text-3xl font-bold tracking-tight mt-4 mb-5">
                Shortcuts on any page.
              </h2>
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
            The mixer, timer, recap prompt, and card renderer live as workspace packages in the
            public repo. They are not published to npm yet.
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
const mixer = createMixer({
  ambientBaseUrl: yourAudioBaseUrl,
})
await mixer.loadAmbient('lofi')
mixer.setLevel('ambient', 0.4)`}
            />
          </div>
          <div className="mt-8">
            <LinkButton href="/developers" variant="outline" size="md">
              Inspect the workspace packages →
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
