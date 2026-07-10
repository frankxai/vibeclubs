import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
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
          <h1 className="mt-4 mb-8 text-4xl font-bold tracking-tight md:text-5xl">
            What the ritual can see.
          </h1>
          <Prose>
            <p>
              <strong>The local proof on the homepage sends nothing to Vibeclubs.</strong> Its
              invite, timer, ship note, recap text, and SVG card stay in your browser tab. Reloading
              clears them.
            </p>
            <h2>Hosted accounts and live timing</h2>
            <p>
              The hosted path can hold your email for magic-link sign-in, the vibeclubs you host,
              basic timer state, and the recaps you choose to save. Supabase provides
              authentication, database storage, and realtime timer broadcasts. Live timing sends a
              club identifier and timer state; it does not need your screen, voice, or page content.
            </p>
            <h2>Chrome extension</h2>
            <p>
              The extension renders an overlay and mixes audio locally with Web Audio. It does not
              read the content of the page underneath it. Its relevant network traffic is timer
              synchronization and any recap request the host explicitly enables.
            </p>
            <h2>Optional AI recap</h2>
            <p>
              AI recap is off by default. A host must enable it before a run and should tell the
              crew before the clock starts. A recap request contains structured facts only: event
              type, cycle count, focus duration, selected work venue, and any club name or handle
              the host entered. It never contains audio, video, chat, screen pixels, or page
              content.
            </p>
            <p>
              Anthropic processes that structured request to generate the recap. Vibeclubs does not
              persist the raw recap request as a separate record. A generated recap is saved only
              when the signed-in hosted flow stores it with the run. Saved run history remains
              until the account holder deletes it or requests deletion.
            </p>
            <h2>Your choices</h2>
            <p>
              Keep AI recap off and use the deterministic local card. If you enable it, tell the
              crew first. You can request an export or deletion at{' '}
              <a href="mailto:privacy@vibeclubs.ai">privacy@vibeclubs.ai</a>. We target a response
              within seven days.
            </p>
            <h2>Processors</h2>
            <p>
              Vercel hosts the site. Supabase supports the hosted account and live timer. Anthropic
              receives structured recap requests only when the optional recap is enabled. Suno is
              used only when a user deliberately requests supported music generation.
            </p>
            <p className="mt-8 text-xs text-white/40">Last updated 2026-07-10.</p>
          </Prose>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
