import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { LinkButton } from '@/components/ui'

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="lg" className="pt-32">
        <Container width="md" className="text-center">
          <Eyebrow className="inline-flex">404</Eyebrow>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mt-5 mb-5">
            Not here.
          </h1>
          <p className="text-white/60 mb-10 text-lg">
            Either the vibeclub wrapped, the link is wrong, or you&apos;re hunting a route nobody
            built yet. Either way, there&apos;s elsewhere to be.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/" variant="primary" size="lg">
              Home
            </LinkButton>
            <LinkButton href="/explore" variant="outline" size="lg">
              Find a vibeclub
            </LinkButton>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
