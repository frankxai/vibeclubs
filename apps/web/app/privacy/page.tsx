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
              Account-backed hosting is currently closed on the public site. When a reviewed build
              enables it, Supabase can hold your email, the vibeclubs you host, timer state, and the
              work you choose to save. Live timing needs a club identifier and timer state; it does
              not need your screen, voice, or page content.
            </p>
            <h2>Chrome extension</h2>
            <p>
              The extension renders an overlay and mixes audio locally with Web Audio. It does not
              read the content of the page underneath it. The public source runs its timer locally.
              A configured build can send timer state through Supabase Realtime. A recap request
              runs only after a person accepts the disclosure and enables it in their own browser.
            </p>
            <h2>Optional AI recap</h2>
            <p>
              AI recap is off by default. Before it can run, each person must accept the notice in
              their own extension and then enable it. The current extension recap event contains a
              club identifier, event type, and cycle count. It does not contain audio, video, chat,
              screen pixels, page content, a club name, a handle, a ship note, or prior recap text.
            </p>
            <p>
              Anthropic processes that structured request to generate the recap. The app code does
              not save the raw request or Claude response as a separate database record. A recap can
              become part of hosted history only if a signed-in client deliberately includes it in a
              run it saves.
            </p>
            <h2>Retention and deletion</h2>
            <p>
              The current database schema has no automatic expiry and no self-service delete
              control. If account-backed hosting opens, a saved record can remain in Supabase until
              the account is deleted or Vibeclubs support completes an authorized deletion. Under
              the current schema, deleting an account also deletes its saved history.
            </p>
            <h2>Your choices</h2>
            <p>
              Keep AI recap off and use the deterministic local card. If account-backed hosting
              opens, the published path for an export or deletion request is{' '}
              <a href="mailto:open@vibeclubs.ai">open@vibeclubs.ai</a>. There is no published fixed
              response-time commitment yet.
            </p>
            <h2>Analytics boundary</h2>
            <p>
              No analytics provider is installed. Club names, handles, ship notes, and recap text
              are not sent to analytics.
            </p>
            <h2>Processors</h2>
            <p>
              Vercel hosts the site. Supabase and Anthropic are present in source but their public
              account and recap paths stay closed until they have production receipts. The public
              build does not send requests to Suno.
            </p>
            <p className="mt-8 text-xs text-white/40">Last updated 2026-07-24.</p>
          </Prose>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}
