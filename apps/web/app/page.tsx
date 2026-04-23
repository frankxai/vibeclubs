import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import {
  Badge,
  Button,
  LinkButton,
  Card,
  CardEyebrow,
  CardTitle,
  CardBody,
  Fader,
  TimerDisplay,
  Kbd,
} from '@/components/ui'
import { Container, Section, Eyebrow } from '@/components/layout/container'
import { FeatureCard } from '@/components/patterns/feature-card'
import { TierCard } from '@/components/patterns/tier-card'
import { SessionCardPreview } from '@/components/patterns/session-card-preview'
import { AnimatedAurora } from '@/components/patterns/animated-aurora'
import { SparkOrb } from '@/components/patterns/spark-orb'
import { LaunchMark } from '@/components/patterns/launch-mark'
import { Reveal, Stagger, StaggerItem, GradientText } from '@/components/motion'
import { CLUB_TEMPLATES } from '@/lib/club-templates'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://vibeclubs.ai/#org',
      name: 'Vibeclubs',
      url: 'https://vibeclubs.ai',
      logo: 'https://vibeclubs.ai/logo.png',
      sameAs: ['https://github.com/frankxai/vibeclubs', 'https://x.com/vibeclubsai'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://vibeclubs.ai/#website',
      url: 'https://vibeclubs.ai',
      name: 'Vibeclubs',
      publisher: { '@id': 'https://vibeclubs.ai/#org' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Vibeclubs',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Chrome',
      description:
        'Claude Code + your crew + a soundtrack. Host a vibeclub — shared pomodoro, ambient mixer, auto-recap.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: undefined,
    },
  ],
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      {/* HERO */}
      <div className="relative overflow-hidden">
        <AnimatedAurora />
        <SparkOrb
          size={760}
          hue="dual"
          className="left-[-12%] top-[6%] opacity-70 md:opacity-90"
        />
        <SparkOrb
          size={420}
          hue="violet"
          className="right-[-6%] top-[38%] hidden md:block opacity-60"
        />
        <Container as="section" width="xl" className="relative pt-40 pb-28">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
            <Stagger gap={0.09} amount={0.1}>
              <StaggerItem>
                <div className="flex items-center gap-3 mb-8">
                  <Badge tone="signal" dot size="xs">
                    Sprint 1 shipping May 14
                  </Badge>
                  <span className="text-xs text-white/40 font-mono">v0.1 · MIT</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.92] mb-8">
                  Host a
                  <br />
                  <GradientText tone="warm">vibeclub.</GradientText>
                </h1>
              </StaggerItem>
              <StaggerItem>
                <p className="text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed mb-10">
                  Claude Code + your crew + a soundtrack. Lock in for 90 minutes. Ship the thing.
                  Recap lands on your profile when you&apos;re done.
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="flex flex-wrap items-center gap-3">
                  <LinkButton
                    href="/start"
                    variant="primary"
                    size="xl"
                    className="vc-shimmer-border"
                  >
                    Host a vibeclub →
                  </LinkButton>
                  <LinkButton href="/explore" variant="outline" size="xl">
                    Find one tonight
                  </LinkButton>
                  <LinkButton href="/extension" variant="ghost" size="xl">
                    Install extension
                  </LinkButton>
                </div>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-10 text-sm text-white/40 font-mono flex items-center gap-3 flex-wrap">
                  <span>build your own:</span>
                  <Link
                    href="/developers"
                    className="text-white/60 hover:text-white border-b border-white/20 hover:border-white/50 transition"
                  >
                    pnpm i @vibeclubs/vibe-mix
                  </Link>
                  <span className="opacity-40">·</span>
                  <span className="flex items-center gap-1 text-white/50">
                    press <Kbd>/</Kbd> anywhere
                  </span>
                </p>
              </StaggerItem>
            </Stagger>
            <Reveal direction="left" delay={0.25} amount={0.1}>
              <div className="relative lg:pl-8">
                <SessionCardPreview
                  clubName="lofi-coders-amsterdam"
                  handle="@frankx"
                  minutes={90}
                  cycles={3}
                  platform="Discord"
                  date="Apr 21 2026"
                  className="shadow-2xl rotate-[-2deg]"
                />
                <div className="absolute -top-4 -right-4 rotate-[4deg] hidden sm:block">
                  <div className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-xl">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-1">
                      live
                    </div>
                    <TimerDisplay mmss="32:14" phase="focus" size="md" />
                    <div className="text-[10px] text-white/40 mt-1">cycle 2 of 3</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* THESIS */}
      <Section pad="lg" border>
        <Container width="xl">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <Reveal direction="up">
              <Eyebrow>What it is</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mt-4">
                Not a meeting.
                <br />
                Not a study timer.
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <div className="text-lg text-white/70 leading-relaxed space-y-4 pt-4 max-w-2xl">
                <p>
                  A vibeclub is what your crew does when you all have something to ship. Open Meet,
                  Discord, Zoom, or meet at a café. Turn on the Vibeclubs extension. Hit start.
                </p>
                <p>
                  Everyone in the club shares the soundtrack and hits the same pomodoro. Claude
                  keeps quiet notes on the side. When the session ends, you get a card. You post the
                  card. Next Sunday, three more people show up.
                </p>
                <p className="text-white/50">
                  Format, not platform. It works on what you already use.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* HOW */}
      <Section pad="lg" border>
        <Container width="xl">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow className="inline-flex">How it works</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 max-w-3xl mx-auto">
                Pick your platform. Share the soundtrack. Lock in.
              </h2>
            </div>
          </Reveal>
          <Stagger gap={0.1} amount={0.15}>
            <div className="grid md:grid-cols-3 gap-4">
              <StaggerItem>
                <FeatureCard
                  eyebrow="01"
                  title="Pick your platform"
                  body="Meet, Discord, Zoom, in-person. We don't replace what already works — we overlay it."
                />
              </StaggerItem>
              <StaggerItem>
                <FeatureCard
                  eyebrow="02"
                  title="Share the soundtrack"
                  body="Three faders: ambient, AI music (Suno), your tab audio. Mix lives in each person's ears, per DMCA-safe design."
                />
              </StaggerItem>
              <StaggerItem>
                <FeatureCard
                  eyebrow="03"
                  title="Lock in together"
                  body="25/5, 50/10, 90/20 or custom. Everyone in the club hits the same block via Supabase Realtime broadcast. You feel it."
                />
              </StaggerItem>
            </div>
          </Stagger>

          {/* Live mixer preview */}
          <Reveal direction="up" delay={0.15}>
            <Card pad="lg" className="mt-6 max-w-2xl mx-auto">
              <CardEyebrow>Live preview · the mixer</CardEyebrow>
              <CardTitle as="h3" className="mb-6">
                The three faders, right here.
              </CardTitle>
              <div className="space-y-4">
                <Fader label="Ambient" defaultValue={35} accent="amber" />
                <Fader label="Music" defaultValue={25} accent="violet" />
                <Fader label="Voice" defaultValue={85} accent="signal" />
              </div>
              <CardBody className="mt-6">
                Muted here — in the extension, these drive a Web Audio graph with equal-power curves
                and optional duck-on-voice.
              </CardBody>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* RECAP */}
      <Section pad="lg" border>
        <Container width="xl">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-center">
            <Reveal direction="up">
              <div>
                <Eyebrow>After the session</Eyebrow>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mt-4 mb-6">
                  Your vibeclub gets a recap.
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-5 max-w-xl">
                  Claude watches the session. Never interrupts. Writes a short recap when the timer
                  stops — duration, cycles, what shipped. The card lands on your profile. You
                  screenshot it. You post it. That&apos;s the distribution.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <Badge tone="outline" size="xs">
                    Opt-in
                  </Badge>
                  <span>·</span>
                  <span>Off by default.</span>
                  <span>·</span>
                  <span>Zero drama.</span>
                </div>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.15}>
              <SessionCardPreview
                clubName="morning-writers"
                handle="@lex"
                minutes={100}
                cycles={2}
                platform="Meet"
                date="Apr 19 2026"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* TEMPLATES */}
      <Section pad="lg" border>
        <Container width="xl">
          <Reveal>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <Eyebrow>Start fast</Eyebrow>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
                  Pick a template.
                  <br />
                  Host in 60 seconds.
                </h2>
              </div>
              <LinkButton href="/start" variant="outline" size="lg">
                Browse all templates →
              </LinkButton>
            </div>
          </Reveal>
          <Stagger gap={0.06} amount={0.1}>
            <div className="grid md:grid-cols-3 gap-3">
              {CLUB_TEMPLATES.slice(0, 6).map((t) => (
                <StaggerItem key={t.id}>
                  <Link
                    href={`/start?template=${t.id}`}
                    className="group block h-full rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04] transition p-5 flex items-start gap-3"
                  >
                    <span className="text-2xl opacity-80">{t.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold group-hover:text-amber-300 transition">
                        {t.label}
                      </div>
                      <div className="text-xs text-white/50 mt-1">{t.tagline}</div>
                    </div>
                    <span className="text-white/30 group-hover:text-amber-300 transition">→</span>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </Container>
      </Section>

      {/* THREE SURFACES */}
      <Section pad="lg" border>
        <Container width="xl">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow className="inline-flex">The stack</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 max-w-3xl mx-auto">
                Open source. Works anywhere.
              </h2>
            </div>
          </Reveal>
          <Stagger gap={0.1}>
            <div className="grid md:grid-cols-3 gap-4">
              <StaggerItem>
                <Link href="/extension" className="block h-full">
                  <FeatureCard
                    eyebrow="Chrome extension"
                    title="The runtime"
                    body="Overlays the mixer and timer on Meet, Discord, YouTube, or any tab. This is where the vibe lives."
                  />
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/explore" className="block h-full">
                  <FeatureCard
                    eyebrow="vibeclubs.ai"
                    title="The directory"
                    body="Find a crew. List your own. Your profile collects the cards from every session you've locked into."
                  />
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/developers" className="block h-full">
                  <FeatureCard
                    eyebrow="npm packages"
                    title="The toolkit"
                    body="Five MIT packages. Fork the mixer, the pomodoro sync, the recap prompts. Build your own vibe."
                  />
                </Link>
              </StaggerItem>
            </div>
          </Stagger>
        </Container>
      </Section>

      {/* PRICING */}
      <Section pad="lg" border>
        <Container width="lg" className="text-center">
          <Reveal>
            <Eyebrow className="inline-flex">Pricing</Eyebrow>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4 mb-5">
              Free where it matters.
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-12 text-lg leading-relaxed">
              Host unlimited vibeclubs. Install the extension. Use the packages. No card, no signup
              gate. Pro ships Sprint 2 for builders who want Suno + full Claude recaps.
            </p>
          </Reveal>
          <Stagger gap={0.1} amount={0.2}>
            <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <StaggerItem>
                <TierCard
                  name="Free"
                  price="$0"
                  tag="Forever"
                  points={[
                    'Unlimited vibeclubs',
                    'Three ambient presets',
                    'Synced pomodoro',
                    'Basic recap',
                    'Open source everything',
                  ]}
                />
              </StaggerItem>
              <StaggerItem>
                <div className="vc-shimmer-border rounded-2xl">
                  <TierCard
                    name="Pro"
                    price="$12/mo"
                    featured
                    points={[
                      'Everything in Free',
                      'Suno AI music generation',
                      'Full Claude recaps',
                      'Custom mixer presets',
                      'Featured club listing',
                    ]}
                  />
                </div>
              </StaggerItem>
            </div>
          </Stagger>
        </Container>
      </Section>

      {/* FINAL CTA */}
      <Section pad="lg" border>
        <Container width="md" className="text-center">
          <Reveal direction="scale">
            <div className="flex justify-center mb-8">
              <LaunchMark size={96} className="drop-shadow-[0_0_32px_rgba(245,158,11,0.35)]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Lock in. Ship. Post the card.
            </h2>
            <p className="text-white/60 mb-10 text-lg">
              Drop your first vibeclub on the directory tonight. Ship the extension next month. Your
              crew is already at their desks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <LinkButton
                href="/start"
                variant="primary"
                size="xl"
                className="vc-shimmer-border"
              >
                Host a vibeclub →
              </LinkButton>
              <LinkButton
                href="https://github.com/frankxai/vibeclubs"
                variant="ghost"
                size="xl"
                external
              >
                ⭐ Star on GitHub
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Footer />
    </main>
  )
}
