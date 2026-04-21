import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { Prose } from '@/components/patterns/prose'

export const metadata = { title: 'Privacy' }

export default function Privacy() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="md">
          <Eyebrow>Privacy</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-8">
            What we collect. What we don&apos;t.
          </h1>
          <Prose>
            <p>
              <strong>Vibeclubs collects the minimum.</strong> We hold your email (magic-link auth),
              the clubs you host, and the sessions you log. Nothing else. No analytics SDKs that
              track you across the web. No ad pixels. No behavior graphs.
            </p>
            <h2>The Chrome extension</h2>
            <p>
              The extension <strong>never reads page content</strong>. It renders an overlay and
              mixes audio locally via Web Audio. The only network traffic is: the pomodoro
              broadcast (club slug + timer state to Supabase Realtime) and a session summary
              (duration + cycle count to our API). Open source so you can verify —{' '}
              <a href="https://github.com/frankxai/vibeclubs">read the source</a>.
            </p>
            <h2>Auto-recaps</h2>
            <p>
              If you enable the AI recap, a small Claude call runs per pomodoro event. Claude sees
              only the event type and basic session context (cycle count, focus minutes, platform
              name). It never sees your voice, your screen, or any page content. Recap outputs are
              stored on your session; you can delete them.
            </p>
            <h2>Third-party processors</h2>
            <p>
              Supabase (auth + Postgres + Realtime). Anthropic (recap Claude calls). Suno (music
              generation, Pro only). Vercel (hosting). No other third parties touch your data.
            </p>
            <h2>Rights</h2>
            <p>
              Email <a href="mailto:privacy@vibeclubs.ai">privacy@vibeclubs.ai</a> to request an
              export or deletion. We respond within 7 days.
            </p>
            <p className="text-white/40 text-xs mt-8">Last updated 2026-04-21.</p>
          </Prose>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
