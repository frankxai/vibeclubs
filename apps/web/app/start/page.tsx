import { Suspense } from 'react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Reveal } from '@/components/motion'
import { TimerRingCycling } from '@/components/three'
import { LinkButton } from '@/components/ui'
import { hasHostedConfig } from '@/lib/hosted-config'
import { StartForm } from './start-form'

export const metadata = {
  title: 'Host a vibeclub',
  description: 'Pick what you are shipping, the platform, the rhythm. 60 seconds.',
}

export default function StartPage() {
  const hostedReady = hasHostedConfig()

  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="xl">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-16 items-start">
            <Reveal direction="up">
              <div>
                <Eyebrow>Host</Eyebrow>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 mt-4">
                  Host a vibeclub.
                </h1>
                <p className="text-lg text-white/60 mb-12 leading-relaxed max-w-xl">
                  Pick a template or build your own. Share the link. Your crew shows up. That&apos;s
                  the whole thing.
                </p>
                {hostedReady ? (
                  <Suspense fallback={null}>
                    <StartForm />
                  </Suspense>
                ) : (
                  <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-300">
                      Hosted path closed
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      Account-backed hosting is not live yet.
                    </h2>
                    <p className="mt-3 max-w-xl leading-7 text-white/60">
                      The local proof and public club files work now. Magic links and saved
                      vibeclubs stay closed until the production database has a release receipt.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <LinkButton href="/#try-it" size="md">
                        Run the local proof
                      </LinkButton>
                      <LinkButton
                        href="https://github.com/frankxai/vibeclubs/tree/main/content/clubs"
                        external
                        variant="outline"
                        size="md"
                      >
                        List a public club via PR ↗
                      </LinkButton>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.15} className="hidden lg:block">
              <div className="sticky top-32">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e0e16] to-[#0a0a0f] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="live-dot signal" />
                    <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-white/50">
                      timer states · source preview
                    </span>
                  </div>
                  <TimerRingCycling />
                  <div className="mt-5 space-y-1.5 text-xs text-white/50 leading-relaxed">
                    <p>
                      <span className="text-amber-300">Idle</span> — the club is lined up, waiting
                      for the host to start.
                    </p>
                    <p>
                      <span className="text-[#4fd18c]">Focus</span> — the local timer runs the
                      selected block in this browser.
                    </p>
                    <p>
                      <span className="text-[#a78bfa]">Break</span> — stand up, stretch, drop a
                      screenshot in chat.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
