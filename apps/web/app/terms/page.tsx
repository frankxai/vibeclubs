import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Prose } from '@/components/patterns/prose'

export const metadata = { title: 'Terms' }

export default function Terms() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="md">
          <Eyebrow>Terms</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-8">Simple terms.</h1>
          <Prose>
            <p>
              Vibeclubs is provided as-is, MIT-licensed on the{' '}
              <a href="https://github.com/frankxai/vibeclubs">source</a>. You can self-host, fork,
              or use the hosted version at vibeclubs.ai.
            </p>
            <h2>Your content</h2>
            <p>
              You keep ownership of the club details and work you choose to save. Account-backed
              storage is currently closed; if it opens, Vibeclubs will not claim rights beyond what
              is needed to run the format.
            </p>
            <h2>Conduct</h2>
            <p>
              Don&apos;t be a jerk in public clubs. Don&apos;t host hate, harassment, or anything
              illegal. We can remove clubs or sessions that violate this rule. Self-hosters set
              their own rules.
            </p>
            <h2>Music + audio</h2>
            <p>
              The public build does not ship an ambient catalog or Suno integration. Bring only
              audio you have the right to use. Don&apos;t rebroadcast someone else&apos;s
              copyrighted music through Vibeclubs.
            </p>
            <h2>Liability</h2>
            <p>
              Vibeclubs is a focus tool. If your session doesn&apos;t ship a feature, we&apos;re not
              liable. Use at your own risk — as with all MIT software.
            </p>
            <p className="text-white/40 text-xs mt-8">Last updated 2026-07-24.</p>
          </Prose>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
