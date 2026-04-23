import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Avatar, LinkButton } from '@/components/ui'
import { Container, Eyebrow, Section } from '@/components/layout/container'
import { StatBlock } from '@/components/patterns/stat-block'
import { SessionCardPreview } from '@/components/patterns/session-card-preview'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { SessionCard3DLazy } from '@/components/three'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { SessionRow, UserRow } from '@/lib/supabase/types'

interface Params {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Params) {
  const { handle } = await params
  return { title: `@${handle}` }
}

export default async function UserPage({ params }: Params) {
  const { handle } = await params
  const { user, sessions } = await loadUser(handle)
  if (!user) notFound()

  const totalFocus = sessions.reduce((sum, s) => sum + s.focus_minutes, 0)
  const totalCycles = sessions.reduce((sum, s) => sum + s.pomodoro_cycles, 0)

  const latest = sessions[0]

  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="xl">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center mb-16">
            <Reveal direction="up">
              <div>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar src={user.avatar_url} name={user.display_name ?? handle} size="xl" />
                  <div className="min-w-0">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                      {user.display_name ?? handle}
                    </h1>
                    <div className="text-white/50 font-mono text-sm">@{user.handle ?? handle}</div>
                  </div>
                </div>
                {user.bio && (
                  <p className="text-white/70 max-w-xl leading-relaxed text-lg">{user.bio}</p>
                )}
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.15}>
              <div className="relative">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e0e16] to-[#0a0a0f] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-white/45">
                      latest vibeclub
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-white/40">
                      drag · tap to flip
                    </div>
                  </div>
                  <SessionCard3DLazy className="w-full aspect-[2/1.1]" />
                  {latest && (
                    <div className="flex items-center justify-between mt-5 text-xs text-white/55 font-mono">
                      <span>
                        {latest.focus_minutes}min · {latest.pomodoro_cycles} cycle
                        {latest.pomodoro_cycles === 1 ? '' : 's'}
                      </span>
                      <span>{new Date(latest.started_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          <Stagger gap={0.08}>
            <div className="grid grid-cols-3 gap-3 mb-16">
              <StaggerItem>
                <StatBlock value={sessions.length.toString()} label="Sessions" />
              </StaggerItem>
              <StaggerItem>
                <StatBlock value={totalFocus.toString()} label="Minutes shipped" tone="signal" />
              </StaggerItem>
              <StaggerItem>
                <StatBlock value={totalCycles.toString()} label="Cycles" tone="violet" />
              </StaggerItem>
            </div>
          </Stagger>

          <Reveal>
            <Eyebrow className="mb-4">Recent vibeclubs</Eyebrow>
          </Reveal>
          {sessions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="text-white/50 text-sm mb-5">
                No sessions yet. Install the extension and drop into a vibeclub.
              </p>
              <LinkButton href="/extension" variant="primary" size="md">
                Install extension →
              </LinkButton>
            </div>
          ) : (
            <Stagger gap={0.06}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((s) => (
                  <StaggerItem key={s.id}>
                    <SessionCardPreview
                      clubName={'vibeclub'}
                      handle={`@${user.handle ?? handle}`}
                      minutes={s.focus_minutes}
                      cycles={s.pomodoro_cycles}
                      platform={(s.platform_used ?? 'Discord') as string}
                      date={new Date(s.started_at).toLocaleDateString()}
                    />
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          )}
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

async function loadUser(
  handle: string,
): Promise<{ user: UserRow | null; sessions: SessionRow[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { user: null, sessions: [] }
  try {
    const supabase = await createSupabaseServerClient()
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('handle', handle)
      .maybeSingle()
    if (!user) return { user: null, sessions: [] }
    const { data: sessions } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(20)
    return { user: user as UserRow, sessions: (sessions ?? []) as SessionRow[] }
  } catch {
    return { user: null, sessions: [] }
  }
}
