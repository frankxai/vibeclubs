import Link from 'next/link'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { PLAYBOOK } from './playbook-data'

export const metadata = {
  title: 'How it works',
  description:
    'Host, show up, ship. Short reads on running your first vibeclub, tuning the mixer, the recap, and turning a GenCreator stack into weekly output.',
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
            Short reads. Everything you need to host a vibeclub, tune the mixer, read the recap, and
            turn a GenCreator stack into weekly output. Free to read, free to fork, free to remix
            into your own scene.
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
                  <span className="text-white/30 pt-1 group-hover:text-amber-300 transition">→</span>
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
