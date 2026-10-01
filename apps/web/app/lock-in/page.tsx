import { Suspense } from 'react'
import type { Route } from 'next'
import { ShieldCheck, Zap } from 'lucide-react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, PageHeader, Section } from '@/components/layout/container'
import { Card, CardBody, CardEyebrow, CardTitle, LinkButton } from '@/components/ui'
import { LockInClient } from './lock-in-client'

export const metadata = {
  title: 'Lock in',
  description: 'Run and save a focus block from the web, with explicit consent choices.',
}

export default function LockInPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="2xl">
          <PageHeader
            eyebrow={<Eyebrow>Lock in</Eyebrow>}
            title={<>Ship a block from the web.</>}
            subtitle={
              <>
                The extension is still the best runtime. This path keeps adoption honest: your crew
                can log proof, consent, and exportable data before installing anything.
              </>
            }
            actions={
              <div className="flex flex-wrap gap-3">
                <LinkButton
                  href={'/host' as Route}
                  variant="outline"
                  size="lg"
                  leading={<ShieldCheck size={16} />}
                >
                  Host cockpit
                </LinkButton>
                <LinkButton href="/start" variant="primary" size="lg" leading={<Zap size={16} />}>
                  Host a vibeclub
                </LinkButton>
              </div>
            }
          />

          <div className="mt-14">
            <Suspense fallback={<LockInFallback />}>
              <LockInClient />
            </Suspense>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-3">
            <Card pad="lg">
              <CardEyebrow>Same substrate</CardEyebrow>
              <CardTitle>One session API.</CardTitle>
              <CardBody className="mt-3">
                Web and extension logs both feed consent snapshots, cards, host metrics, and
                exports.
              </CardBody>
            </Card>
            <Card pad="lg">
              <CardEyebrow>Consent first</CardEyebrow>
              <CardTitle>No silent recap.</CardTitle>
              <CardBody className="mt-3">
                Claude writes a recap only when that checkbox is on for the saved block.
              </CardBody>
            </Card>
            <Card pad="lg">
              <CardEyebrow>Review gate</CardEyebrow>
              <CardTitle>Agents draft, hosts approve.</CardTitle>
              <CardBody className="mt-3">
                Risky actions stay in review until the host or owner signs off.
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

function LockInFallback() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-white/50">
      Loading timer...
    </div>
  )
}
