import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Card, CardBody, CardEyebrow, CardTitle, CodeBlock, LinkButton } from '@/components/ui'
import { Reveal } from '@/components/motion'
import { PACKAGES, findPackage } from '@/lib/packages'

interface Params {
  params: Promise<{ pkg: string }>
}

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ pkg: p.slug }))
}

export async function generateMetadata({ params }: Params) {
  const { pkg } = await params
  const found = findPackage(pkg)
  if (!found) return { title: 'Package' }
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'
  const ogTitle = encodeURIComponent(found.name)
  const ogSub = encodeURIComponent(found.tagline)
  return {
    title: found.name,
    description: found.description,
    openGraph: {
      title: found.name,
      description: found.tagline,
      images: [`${site}/api/og?title=${ogTitle}&sub=${ogSub}`],
    },
    twitter: {
      card: 'summary_large_image' as const,
      images: [`${site}/api/og?title=${ogTitle}&sub=${ogSub}`],
    },
  }
}

export default async function PackageDetailPage({ params }: Params) {
  const { pkg } = await params
  const found = findPackage(pkg)
  if (!found) notFound()

  const repoUrl = `https://github.com/frankxai/vibeclubs/tree/main/${found.sourcePath}`
  const npmUrl = `https://www.npmjs.com/package/${found.name}`

  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="lg" as="article">
          <Reveal direction="up">
            <Link
              href="/developers"
              className="text-xs font-mono text-white/45 hover:text-amber-300 transition inline-flex items-center gap-2 mb-6"
            >
              ← all packages
            </Link>
            <Eyebrow className="font-mono">{found.name}</Eyebrow>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-4 mb-5 leading-[1.02]">
              {found.tagline}
            </h1>
            <p className="text-lg text-white/65 max-w-2xl leading-relaxed mb-7">
              {found.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-white/45 mb-8">
              <span className="rounded-full border border-white/10 px-3 py-1.5">MIT</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">
                framework-agnostic
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1.5">
                {found.exports.length} exports
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <LinkButton href={npmUrl} variant="primary" size="md" external>
                Install from npm →
              </LinkButton>
              <LinkButton href={repoUrl} variant="outline" size="md" external>
                View source on GitHub
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="md" border>
        <Container width="lg">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
            <div>
              <Eyebrow>Notes</Eyebrow>
              <ul className="mt-4 space-y-3 text-white/70 text-sm leading-relaxed">
                {found.notes.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="text-amber-400 mt-[2px]">✦</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CodeBlock
              caption="install + import"
              lang="ts"
              code={`pnpm add ${found.name}

${found.importLine}`}
            />
          </div>
        </Container>
      </Section>

      <Section pad="md" border>
        <Container width="lg">
          <Eyebrow>Quickstart</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-6">
            Drop it in and run.
          </h2>
          <CodeBlock caption={`${found.slug}.ts`} lang="ts" code={found.example} />
        </Container>
      </Section>

      <Section pad="md" border>
        <Container width="lg">
          <Eyebrow>API surface</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-6">
            What it exports.
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {found.exports.map((e) => (
              <div
                key={e.symbol}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <code className="font-mono text-amber-300 text-sm">{e.symbol}</code>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-mono">
                    {e.kind}
                  </span>
                </div>
                <div className="text-sm text-white/60 leading-relaxed">{e.summary}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section pad="lg" border>
        <Container width="lg">
          <div className="grid md:grid-cols-2 gap-4">
            <Card pad="lg">
              <CardEyebrow>Other packages</CardEyebrow>
              <CardTitle as="h2" className="mb-4">
                Pair it up.
              </CardTitle>
              <CardBody>
                <ul className="space-y-2">
                  {PACKAGES.filter((p) => p.slug !== found.slug).map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/developers/${p.slug}` as never}
                        className="font-mono text-sm text-white/60 hover:text-amber-300 transition"
                      >
                        {p.name} ↗
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            <Card pad="lg" tone="featured">
              <CardEyebrow>Contribute</CardEyebrow>
              <CardTitle as="h2" className="mb-4">
                Open a PR.
              </CardTitle>
              <CardBody>
                Read{' '}
                <a
                  href="https://github.com/frankxai/vibeclubs/blob/main/CONTRIBUTING.md"
                  className="text-amber-300 hover:underline"
                >
                  CONTRIBUTING.md
                </a>{' '}
                for the vetoes — no breakout rooms, no host controls, no recording-by-default. Then
                drop into{' '}
                <a href={repoUrl} className="text-amber-300 hover:underline">
                  {found.sourcePath}
                </a>{' '}
                and ship.
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  )
}
