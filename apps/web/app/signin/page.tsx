import { Suspense } from 'react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { SigninForm } from './signin-form'

export const metadata = {
  title: 'Sign in',
  description: 'Magic link sign-in. No passwords.',
}

export default function SigninPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="sm">
          <Eyebrow>Sign in</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-5">Magic link.</h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            No passwords. Drop your email, click the link we send, you&apos;re in. We use this only
            to identify the clubs you host and sessions you ship.
          </p>
          <Suspense fallback={null}>
            <SigninForm />
          </Suspense>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
