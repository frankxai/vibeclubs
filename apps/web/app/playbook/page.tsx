import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { PLAYBOOK } from './playbook-data'

export const metadata = {
  title: 'Host a vibeclub: guides for your crew',
  alternates: { canonical: 'https://vibeclubs.ai/playbook' },
  description:
    'Prepare a host pack, choose your existing tools, and lock in with your crew. Guides to hosting, soundtracks, creator projects, and honest recaps.',
}

export default function PlaybookIndex() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="md">
          <Eyebrow>How it works</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4 mb-5 leading-[1.02]">
            Host, show up, ship.
          </h1>
          <p className="text-lg text-white/60 mb-14 leading-relaxed">
            Prepare a host pack, choose a soundtrack, and bring one thing to ship. A human hosts
            on tools the crew already uses. Start with the hosting guide and keep a recap of what
            changed.
          </p>
          <ol className="space-y-2">
            {PLAYBOOK.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/playbook/${p.slug}`}
                  className="group flex items-start gap-5 p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-500/30 transition"
                >
                  <span className="text-white/30 font-mono text-xs pt-1 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold group-hover:text-amber-300 transition">
                      {p.title}
                    </div>
                    <div className="text-sm text-white/60 mt-1">{p.summary}</div>
                  </div>
                  <span className="text-white/30 pt-1 group-hover:text-amber-300 transition">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
