import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { ClubCard } from '@/components/club-card'
import { LinkButton } from '@/components/ui'
import { Container, Eyebrow, Section, PageHeader } from '@/components/layout/container'
import { EmptyState } from '@/components/patterns/empty-state'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ClubRow } from '@/lib/supabase/types'

export const metadata = {
  title: 'Find a vibeclub',
  description:
    'Public vibeclubs hosting in the next week. Find a crew that matches your rhythm and stack.',
}

export default async function ExplorePage() {
  const clubs = await loadClubs()
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="2xl">
          <PageHeader
            eyebrow={<Eyebrow>Find</Eyebrow>}
            title={<>Find a vibeclub.</>}
            subtitle={
              <>
                Clubs hosting in the next week. Pick what matches your rhythm, your stack, your
                timezone. No account to browse — sign in only when you&apos;re ready to host.
              </>
            }
            actions={
              <LinkButton href="/start" variant="primary" size="lg">
                Host your own →
              </LinkButton>
            }
          />
          <div className="mt-14">
            {clubs.length === 0 ? (
              <EmptyState
                title="Directory's warming up."
                description={
                  <>
                    Either Supabase isn&apos;t wired yet (see{' '}
                    <code className="text-amber-300">ENVIRONMENT.md</code>) or you&apos;re the
                    first. Host one and drag three friends in.
                  </>
                }
                cta={
                  <LinkButton href="/start" variant="primary" size="lg">
                    Host the first vibeclub →
                  </LinkButton>
                }
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

async function loadClubs(): Promise<ClubRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('clubs')
      .select('*')
      .eq('is_active', true)
      .order('tier', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(60)
    return (data ?? []) as ClubRow[]
  } catch {
    return []
  }
}
