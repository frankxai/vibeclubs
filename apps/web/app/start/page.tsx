import { Suspense } from 'react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container } from '@/components/layout/container'
import { LinkButton } from '@/components/ui'
import { hasHostedConfig } from '@/lib/hosted-config'
import { StartForm } from './start-form'
import { BuildStudio } from './build-studio'

export const metadata = {
  title: 'Host a vibeclub — make something together',
  description:
    'A small crew, a shared clock, and something real to show. Build your own vibeclub with a crew invite, a timed agenda, and a ready-to-use build brief.',
  alternates: { canonical: 'https://vibeclubs.ai/start' },
}

export default function StartPage() {
  const hostedReady = hasHostedConfig()
  return (
    <main className="min-h-screen">
      <Nav />
      <Container width="xl" className="pb-20 pt-28 sm:pt-32">
        <header className="mb-10 grid gap-6 border-b border-border pb-8 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-12">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-vibe-amber-soft">
              Your people. Your tools. Your next finish.
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Host a vibeclub.
              <br />
              <span className="text-text-secondary">Make the thing real.</span>
            </h1>
          </div>
          <div>
            <p className="max-w-lg text-lg leading-8 text-text-secondary">
              A small crew, a shared clock, and something real to show. Choose what you&apos;re
              making. Leave with a plan you can run tonight.
            </p>
            <p className="mt-3 text-sm text-vibe-amber-soft">
              Free to use · no account needed · bring your own tools
            </p>
          </div>
        </header>
        <Suspense
          fallback={
            <p className="py-12 text-text-secondary" role="status">
              Opening your host pack…
            </p>
          }
        >
          <BuildStudio
            aiAvailable={
              hostedReady &&
              process.env.AI_BRIEF_ENABLED === 'true' &&
              Boolean(process.env.ANTHROPIC_API_KEY)
            }
          />
        </Suspense>
        <section className="mt-16 border-t border-border pt-10" aria-labelledby="format-heading">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="mb-3 text-sm text-vibe-amber-soft">The format</p>
              <h2 id="format-heading" className="text-2xl font-semibold">
                Good company.
                <br />
                Visible progress.
              </h2>
            </div>
            <p className="leading-7 text-text-secondary">
              The host holds the rhythm. The crew brings the craft. Code, music, words, or a mix:
              each person chooses something small enough to finish.
            </p>
            <p className="leading-7 text-text-secondary">
              AI can help make the work and draft the recap. You decide what is good enough to
              share. Keep the proof, name what remains, then come back for the next one.
            </p>
          </div>
        </section>
        <section
          className="mt-10 rounded-2xl border border-border p-6 sm:p-8"
          aria-labelledby="listing-heading"
        >
          <h2 id="listing-heading" className="text-xl font-semibold">
            Make it a regular thing.
          </h2>
          {hostedReady ? (
            <details className="mt-4">
              <summary className="cursor-pointer text-vibe-amber-soft">
                Publish a public club listing
              </summary>
              <p className="my-5 text-sm leading-6 text-text-secondary">
                This is separate from your private host pack. Review the details before publishing.
              </p>
              <Suspense fallback={<p>Loading listing form…</p>}>
                <StartForm />
              </Suspense>
            </details>
          ) : (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-5">
              <p className="max-w-xl leading-7 text-text-secondary">
                Run your first vibeclub with the pack above. When you want others to find it, submit
                a public listing on GitHub.
              </p>
              <LinkButton
                href="https://github.com/frankxai/vibeclubs/tree/main/content/clubs"
                external
                variant="outline"
              >
                Submit a club listing ↗
              </LinkButton>
            </div>
          )}
        </section>
      </Container>
      <Footer />
    </main>
  )
}
