import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import { RitualProof } from '@/components/ritual-proof'
import { LinkButton } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Lock in with your crew. Ship the thing.',
  description:
    'A focused-work ritual for crews who make things. Host anywhere, run a shared timer, mark what shipped, and keep a recap card.',
  alternates: { canonical: '/' },
}

const flow = [
  ['01', 'Host', 'Name the thing your crew intends to ship.'],
  ['02', 'Join', 'Share one invite and meet wherever you already work.'],
  ['03', 'Lock in', 'Run the same focus and ship rhythm together.'],
  ['04', 'Ship', 'Write down the artifact, decision, or change that moved.'],
  ['05', 'Recap', 'Keep a deterministic card. AI remains optional.'],
] as const

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Vibeclubs',
  url: 'https://vibeclubs.ai',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web, Chrome',
  description:
    'An open focused-work ritual with a shared timer, ship checkpoint, and recap card.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  codeRepository: 'https://github.com/frankxai/vibeclubs',
}

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <section className="relative border-b border-white/8 pt-32 md:pt-40">
        <div className="vc-proof-glow" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1400px] gap-14 px-6 pb-24 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:pb-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Open format · working local proof
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[.96] tracking-[-0.055em] text-white sm:text-6xl md:text-8xl">
              Lock in together.
              <span className="block text-amber-300">Leave with proof.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/62 md:text-xl">
              Vibeclubs gives a crew one focused-work ritual: name the thing, share the clock,
              ship, and keep a recap card. Use Meet, Discord, Zoom, a café, or any place that
              already works.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton href="#try-it" size="xl">
                Run the 6-second proof
              </LinkButton>
              <LinkButton
                href="https://github.com/frankxai/vibeclubs"
                external
                variant="outline"
                size="xl"
              >
                Read the source ↗
              </LinkButton>
            </div>
            <p className="mt-5 text-sm text-white/42">
              No account. No upload. The proof runs in this tab.
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-[#0c0c13]/90 p-3 shadow-[0_30px_100px_rgba(0,0,0,.55)]">
            <div className="rounded-[1.55rem] border border-white/8 bg-white/[0.025] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[.18em] text-amber-300">
                    Product truth
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">One ritual, five visible states</h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/48">
                  LOCAL
                </span>
              </div>
              <ol className="mt-3">
                {flow.map(([number, title, body]) => (
                  <li
                    key={number}
                    className="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-white/7 py-4 last:border-0"
                  >
                    <span className="font-mono text-xs text-amber-300/75">{number}</span>
                    <div>
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/48">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="try-it" className="border-b border-white/8 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-12 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-amber-300">Try the loop</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              The ritual is the product.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/58">
              This short proof calls the same timer engine and recap-card renderer shipped in the
              open-source toolkit. It is intentionally local and fast enough to inspect now.
            </p>
          </div>
          <RitualProof />
        </div>
      </section>

      <section className="border-b border-white/8 py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-amber-300">Open core</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">
              Free format. Hosted upgrade.
            </h2>
          </div>
          <div className="space-y-8 text-base leading-7 text-white/58">
            <div>
              <h3 className="text-lg font-medium text-white">Use the ritual for free</h3>
              <p className="mt-2">
                The playbook and core packages stay MIT: timer sync, audio mixing, structured recap
                prompts, and SVG cards.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Pay when a team needs continuity</h3>
              <p className="mt-2">
                The hosted upgrade is for durable crews: recurring schedules, shared history,
                private access, richer recap controls, and admin clarity. Those capabilities ship
                only when they are verifiable.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <LinkButton href="/playbook" variant="outline" size="lg">
                Read the playbook
              </LinkButton>
              <LinkButton href="/developers" variant="ghost" size="lg">
                Inspect the packages →
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-amber-300">Start honestly</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Bring the work. Invite the crew.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/58">
            Run the local proof first. Host a persistent vibeclub when your team is ready for the
            live workflow.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <LinkButton href="#try-it" size="xl">
              Try the proof
            </LinkButton>
            <LinkButton href="/start" variant="outline" size="xl">
              Host a live vibeclub
            </LinkButton>
          </div>
          <p className="mt-5 text-xs text-white/38">
            Live hosting requires sign-in and configured service credentials.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}
