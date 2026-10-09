import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { ClubCard, type DirectoryClub } from '@/components/club-card'
import { LinkButton } from '@/components/ui'
import { Container, Eyebrow, Section, PageHeader } from '@/components/layout/container'
import { EmptyState } from '@/components/patterns/empty-state'
import { Stagger, StaggerItem } from '@/components/motion'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { loadStaticClubs } from '@/lib/clubs/content'
import type { ClubRow } from '@/lib/supabase/types'

export const metadata = {
  title: 'Listed sessions',
  description:
    'Sessions hosts have chosen to list. Vibeclubs is a format you run with your own crew — this page is optional.',
}

export default async function ExplorePage() {
  const clubs = await loadAllClubs()
  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="2xl">
          <PageHeader
            eyebrow={<Eyebrow>Listed</Eyebrow>}
            title={<>Sessions hosts chose to list.</>}
            subtitle={
              <>
                Vibeclubs is a format: a crew, a timer, a soundtrack, shipped proof. You run it
                with people you already know, on tools you already use. Listing here is optional and
                nothing depends on it.
              </>
            }
            actions={
              <div className="flex flex-wrap gap-3">
                <LinkButton href="/start" variant="primary" size="lg" className="vc-shimmer-border">
                  Host your own →
                </LinkButton>
                <LinkButton
                  href="https://github.com/frankxai/vibeclubs/tree/main/content/clubs"
                  variant="outline"
                  size="lg"
                  external
                >
                  List via PR
                </LinkButton>
              </div>
            }
          />
          <div className="mt-14">
            {clubs.length === 0 ? (
              <EmptyState
                title="Nothing listed yet."
                description={
                  <>
                    No host has listed a session here. That changes nothing about running one — the
                    format works with a link to your own crew. To list yours, drop a{' '}
                    <code className="text-amber-300">.md</code> file in{' '}
                    <code className="text-amber-300">content/clubs/</code>.
                  </>
                }
                cta={
                  <LinkButton href="/start" variant="primary" size="lg">
                    Host the first vibeclub →
                  </LinkButton>
                }
              />
            ) : (
              <Stagger gap={0.06}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clubs.map((club) => (
                    <StaggerItem key={`${club.source ?? 'supabase'}-${club.slug}`}>
                      <ClubCard club={club} />
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            )}
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

async function loadAllClubs(): Promise<DirectoryClub[]> {
  const staticClubs = loadStaticClubs()
  const supabaseClubs = await loadSupabaseClubs()

  // Merge, static winning on slug collision (OSS path is the canonical listing).
  const seenSlugs = new Set(staticClubs.map((c) => c.slug))
  const merged: DirectoryClub[] = [
    ...staticClubs.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      type: c.type,
      platform: c.platform,
      pomodoro_preset: c.preset,
      featured: c.featured,
      source: 'static' as const,
    })),
    ...supabaseClubs
      .filter((c) => !seenSlugs.has(c.slug))
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        type: c.type,
        platform: c.platform,
        pomodoro_preset: c.pomodoro_preset,
        featured: c.tier === 'featured',
        source: 'supabase' as const,
      })),
  ]

  // Featured first, then source (static before supabase), then alphabetical.
  merged.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.source !== b.source) return a.source === 'static' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  return merged
}

async function loadSupabaseClubs(): Promise<ClubRow[]> {
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
