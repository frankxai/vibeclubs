import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { PLAYBOOK, findEntry } from '../playbook-data'

interface Params {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PLAYBOOK.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const entry = findEntry(slug)
  return { title: entry?.title ?? 'Playbook' }
}

export default async function PlaybookEntryPage({ params }: Params) {
  const { slug } = await params
  const entry = findEntry(slug)
  if (!entry) notFound()

  return (
    <main className="min-h-screen">
      <Nav />
      <article className="pt-32 pb-16 px-6 max-w-2xl mx-auto">
        <Link href="/playbook" className="text-sm text-white/50 hover:text-white/80 mb-6 inline-block">
          ← How it works
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{entry.title}</h1>
        <p className="text-white/60 mb-10">{entry.summary}</p>
        <div className="prose prose-invert max-w-none">
          <Markdown body={entry.body} />
        </div>
      </article>
      <Footer />
    </main>
  )
}

function Markdown({ body }: { body: string }) {
  // Minimal markdown renderer — we intentionally keep deps small.
  // Full MDX support can be added via next-mdx-remote once playbook entries need components.
  const blocks = body.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim()
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      )
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-semibold mt-10 mb-3">
          {trimmed.slice(3)}
        </h2>
      )
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^[-*] /, ''))
      return (
        <ul key={i} className="list-disc pl-6 space-y-2 text-white/70 my-4">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    }
    if (/^\d+\. /.test(trimmed)) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^\d+\. /, ''))
      return (
        <ol key={i} className="list-decimal pl-6 space-y-2 text-white/70 my-4">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    }
    return (
      <p key={i} className="text-white/70 leading-relaxed my-4">
        {renderInline(trimmed)}
      </p>
    )
  })
  return <>{blocks}</>
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="text-amber-300 bg-white/5 px-1.5 py-0.5 rounded text-[0.95em]">
          {part.slice(1, -1)}
        </code>
      )
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <Link key={i} href={linkMatch[2]!} className="text-amber-300 hover:underline">
          {linkMatch[1]}
        </Link>
      )
    }
    return <span key={i}>{part}</span>
  })
}
