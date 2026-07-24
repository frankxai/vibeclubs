import { Suspense } from 'react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { LinkButton } from '@/components/ui'
import { hasHostedConfig } from '@/lib/hosted-config'
import { SigninForm } from './signin-form'

export const metadata = {
  title: 'Sign in',
  description: 'Magic link sign-in. No passwords.',
}

export default function SigninPage() {
  const hostedReady = hasHostedConfig()

  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="sm">
          <Eyebrow>Sign in</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-5">Magic link.</h1>
          {hostedReady ? (
            <>
              <p className="mb-8 leading-relaxed text-white/60">
                No passwords. Drop your email, click the link we send, you&apos;re in. We use this
                only to identify the vibeclubs you host and the work you choose to save.
              </p>
              <Suspense fallback={null}>
                <SigninForm />
              </Suspense>
            </>
          ) : (
            <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-6">
              <p className="leading-7 text-white/65">
                Magic-link sign-in is not live. Use the local proof, browse the public clubs, or
                inspect the source while the hosted path is closed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <LinkButton href="/#try-it" size="md">
                  Run the local proof
                </LinkButton>
                <LinkButton href="/explore" variant="outline" size="md">
                  Browse public clubs
                </LinkButton>
              </div>
            </div>
          )}
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
