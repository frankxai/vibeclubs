import { Suspense } from 'react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { StartForm } from './start-form'

export const metadata = {
  title: 'Host a vibeclub',
  description: 'Pick what you are shipping, the platform, the rhythm. 60 seconds.',
}

export default function StartPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="md">
          <Eyebrow>Host</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 mt-4">
            Host a vibeclub.
          </h1>
          <p className="text-lg text-white/60 mb-12 leading-relaxed">
            Pick a template or build your own. Share the link. Your crew shows up. That&apos;s the
            whole thing.
          </p>
          <Suspense fallback={null}>
            <StartForm />
          </Suspense>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
