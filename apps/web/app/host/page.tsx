import type { Route } from 'next'
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  Radio,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, PageHeader, Section } from '@/components/layout/container'
import { EmptyState } from '@/components/patterns/empty-state'
import {
  Badge,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  LinkButton,
  buttonStyles,
} from '@/components/ui'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type {
  AgentRunRow,
  ClubRow,
  DataExportRow,
  SessionCardRow,
  SessionParticipantRow,
  SessionRow,
  SocialDraftRow,
} from '@/lib/supabase/types'

export const metadata = {
  title: 'Host cockpit',
  description: 'See status, growth signal, review queue, proof shipped, and export readiness.',
}

type DashboardState =
  | { kind: 'not_configured' }
  | { kind: 'signed_out' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ready'
      clubs: ClubRow[]
      sessions: SessionRow[]
      participants: SessionParticipantRow[]
      cards: SessionCardRow[]
      agentRuns: AgentRunRow[]
      socialDrafts: SocialDraftRow[]
      exports: DataExportRow[]
    }

export default async function HostPage() {
  const state = await loadDashboard()

  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="2xl">
          <PageHeader
            eyebrow={<Eyebrow>Host cockpit</Eyebrow>}
            title={<>Run the loop.</>}
            subtitle={
              <>
                Status, time saved, growth signal, review queue, and export readiness. No fake
                billing, no mystery automation: every action has an audit trail.
              </>
            }
            actions={
              <div className="flex flex-wrap gap-3">
                <LinkButton
                  href={'/lock-in' as Route}
                  variant="primary"
                  size="lg"
                  leading={<Zap size={16} />}
                >
                  Lock in
                </LinkButton>
                <LinkButton
                  href={'/host/review' as Route}
                  variant="secondary"
                  size="lg"
                  leading={<ShieldCheck size={16} />}
                >
                  Review queue
                </LinkButton>
                <LinkButton
                  href="/start"
                  variant="outline"
                  size="lg"
                  leading={<ArrowRight size={16} />}
                >
                  Host one
                </LinkButton>
              </div>
            }
          />

          <div className="mt-14">
            <DashboardContent state={state} />
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

function DashboardContent({ state }: { state: DashboardState }) {
  if (state.kind === 'not_configured') {
    return (
      <EmptyState
        title="Cockpit needs Supabase."
        description="Set the Supabase URL and anon key, then this page becomes the host readout."
        cta={
          <LinkButton href="/developers" variant="outline" size="lg">
            Read the source
          </LinkButton>
        }
      />
    )
  }

  if (state.kind === 'signed_out') {
    return (
      <EmptyState
        title="Sign in to see your cockpit."
        description="Magic link only. Once you are in, the page shows the vibeclubs you host and what needs review."
        cta={
          <LinkButton href={'/signin?next=/host' as Route} variant="primary" size="lg">
            Sign in
          </LinkButton>
        }
      />
    )
  }

  if (state.kind === 'error') {
    return (
      <EmptyState
        title="Cockpit is waiting on the substrate."
        description={state.message}
        cta={
          <LinkButton href="/start" variant="outline" size="lg">
            Back to host
          </LinkButton>
        }
      />
    )
  }

  if (state.clubs.length === 0) {
    return (
      <EmptyState
        title="No vibeclub yet."
        description="Create one, share the link, then this cockpit turns into your daily readout."
        cta={
          <LinkButton href="/start" variant="primary" size="lg">
            Host a vibeclub
          </LinkButton>
        }
      />
    )
  }

  const model = buildDashboardModel(state)

  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {model.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.35fr_0.95fr] gap-4 items-start">
        <section className="space-y-4">
          <SectionHeader eyebrow="Status" title="What needs the host today." />
          <div className="grid md:grid-cols-2 gap-3">
            <ActionTile
              tone={model.pendingReviews > 0 ? 'featured' : 'base'}
              icon={<ShieldCheck size={18} />}
              title={`${model.pendingReviews} agent review${model.pendingReviews === 1 ? '' : 's'}`}
              body="High-risk or irreversible work stays paused until a human approves it."
              cta={
                <LinkButton
                  href={'/host/review' as Route}
                  variant="outline"
                  size="sm"
                  leading={<ShieldCheck size={14} />}
                >
                  Review
                </LinkButton>
              }
            />
            <ActionTile
              tone={model.draftsWaiting > 0 ? 'featured' : 'base'}
              icon={<TrendingUp size={18} />}
              title={`${model.draftsWaiting} launch draft${model.draftsWaiting === 1 ? '' : 's'}`}
              body="Growth posts are drafts first. Nothing gets published from this substrate."
              cta={
                <LinkButton
                  href={'/host/review' as Route}
                  variant="outline"
                  size="sm"
                  leading={<ShieldCheck size={14} />}
                >
                  Review
                </LinkButton>
              }
            />
            <ActionTile
              icon={<Download size={18} />}
              title={model.latestExport ? 'Export ready' : 'Export not saved yet'}
              body={
                model.latestExport
                  ? `Latest bundle: ${formatDate(model.latestExport.created_at)}.`
                  : 'Create a portable JSON bundle whenever you want an audit copy.'
              }
              cta={
                <a href="/api/export" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  <Download size={14} />
                  Export data
                </a>
              }
            />
            <ActionTile
              icon={<Radio size={18} />}
              title={model.liveStatus}
              body="The strongest signal is simple: people keep showing up and shipping proof."
              cta={
                <LinkButton
                  href={'/lock-in' as Route}
                  variant="secondary"
                  size="sm"
                  leading={<Zap size={14} />}
                >
                  Start block
                </LinkButton>
              }
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow="Money signal" title={model.moneySignal.title} />
          <Card pad="lg" tone={model.moneySignal.tone}>
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-amber-300">
                <Wallet size={18} />
              </div>
              <div>
                <CardEyebrow className="mb-0">Offer path</CardEyebrow>
                <CardTitle>{model.moneySignal.label}</CardTitle>
              </div>
            </div>
            <CardBody>{model.moneySignal.body}</CardBody>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <MiniFact label="repeat clubs" value={model.repeatClubs.toString()} />
              <MiniFact label="proof cards" value={state.cards.length.toString()} />
              <MiniFact label="drafts" value={state.socialDrafts.length.toString()} />
            </div>
          </Card>
        </section>
      </div>

      <div className="grid xl:grid-cols-[1fr_1fr] gap-4 items-start">
        <section className="space-y-4">
          <SectionHeader eyebrow="Vibeclubs" title="Host portfolio." />
          <div className="grid gap-3">
            {state.clubs.map((club) => {
              const clubSessions = state.sessions.filter((session) => session.club_id === club.id)
              const clubCards = state.cards.filter((card) => card.club_id === club.id)
              return (
                <Card key={club.id} pad="lg" interactive>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardEyebrow>{club.type}</CardEyebrow>
                      <CardTitle>{club.name}</CardTitle>
                      <CardBody className="mt-2 line-clamp-2">
                        {club.description || 'No description yet.'}
                      </CardBody>
                    </div>
                    <Badge tone={club.is_active ? 'signal' : 'outline'} size="xs">
                      {club.is_active ? 'live' : 'paused'}
                    </Badge>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <MiniFact label="blocks" value={clubSessions.length.toString()} />
                    <MiniFact label="minutes" value={sumFocus(clubSessions).toString()} />
                    <MiniFact label="cards" value={clubCards.length.toString()} />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <LinkButton
                      href={`/club/${club.slug}` as Route}
                      variant="outline"
                      size="sm"
                      trailing={<ArrowRight size={14} />}
                    >
                      View
                    </LinkButton>
                    <LinkButton
                      href={'/lock-in' as Route}
                      variant="ghost"
                      size="sm"
                      leading={<Zap size={14} />}
                    >
                      Lock in
                    </LinkButton>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow="Recent proof" title="What the crew shipped." />
          {state.sessions.length === 0 ? (
            <EmptyPanel text="No logged blocks yet. Start from the web path or the extension." />
          ) : (
            <div className="space-y-2">
              {state.sessions.slice(0, 8).map((session) => (
                <div
                  key={session.id}
                  className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-medium">{formatDate(session.started_at)}</div>
                    <div className="mt-1 text-xs text-white/45">
                      {session.platform_used ?? 'web'} · {session.pomodoro_cycles} cycle
                      {session.pomodoro_cycles === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div className="font-mono text-amber-300">{session.focus_minutes}m</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string
  value: string
  detail: string
  icon: React.ReactNode
}) {
  return (
    <Card pad="lg">
      <div className="flex items-center justify-between gap-3">
        <CardEyebrow className="mb-0">{label}</CardEyebrow>
        <div className="text-white/40">{icon}</div>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      <CardBody className="mt-2">{detail}</CardBody>
    </Card>
  )
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  )
}

function ActionTile({
  title,
  body,
  icon,
  tone = 'base',
  cta,
}: {
  title: string
  body: string
  icon: React.ReactNode
  tone?: 'base' | 'featured'
  cta?: React.ReactNode
}) {
  return (
    <Card pad="lg" tone={tone}>
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-amber-300">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
      <CardBody className="mt-2">{body}</CardBody>
      {cta && <div className="mt-5">{cta}</div>}
    </Card>
  )
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
      <div className="font-mono text-lg text-white">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</div>
    </div>
  )
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-sm text-white/50">
      {text}
    </div>
  )
}

function buildDashboardModel(state: Extract<DashboardState, { kind: 'ready' }>) {
  const totalFocus = sumFocus(state.sessions)
  const crewCount = new Set(state.participants.map((participant) => participant.user_id)).size
  const pendingReviews = state.agentRuns.filter(
    (run) => run.approval_state === 'pending' || run.status === 'needs_review',
  ).length
  const draftsWaiting = state.socialDrafts.filter(
    (draft) => draft.approval_required || draft.status === 'needs_review',
  ).length
  const sessionsByClub = new Map<string, number>()
  for (const session of state.sessions) {
    if (!session.club_id) continue
    sessionsByClub.set(session.club_id, (sessionsByClub.get(session.club_id) ?? 0) + 1)
  }
  const repeatClubs = state.clubs.filter((club) => (sessionsByClub.get(club.id) ?? 0) >= 2).length
  const latestExport = state.exports[0] ?? null

  const moneySignal =
    repeatClubs > 0 && state.cards.length >= 3
      ? {
          title: 'Repeatable enough to package.',
          label: 'Warm',
          tone: 'featured' as const,
          body: 'You have repeat blocks plus proof cards. Next move: founder offer, cohort cap, then paid host kit. Keep billing out until retention is boring.',
        }
      : state.sessions.length >= 2
        ? {
            title: 'Early demand, keep proving it.',
            label: 'Early',
            tone: 'base' as const,
            body: 'The loop has started. Push for repeat blocks and proof cards before pricing. Money follows a reliable habit, not a launch page.',
          }
        : {
            title: 'Needs first repeat signal.',
            label: 'Cold',
            tone: 'base' as const,
            body: 'Start with hosted blocks, visible proof, and drafts. Do not charge before there is a repeated lock-in habit.',
          }

  return {
    pendingReviews,
    draftsWaiting,
    repeatClubs,
    latestExport,
    liveStatus: state.sessions.length > 0 ? 'Loop is moving' : 'No block logged yet',
    moneySignal,
    metrics: [
      {
        label: 'Time saved',
        value: totalFocus >= 60 ? `${Math.round(totalFocus / 60)}h` : `${totalFocus}m`,
        detail: `${state.sessions.length} logged block${state.sessions.length === 1 ? '' : 's'} across your vibeclubs.`,
        icon: <Clock3 size={18} />,
      },
      {
        label: 'Crew',
        value: crewCount.toString(),
        detail: 'Unique signed-in people seen in logged blocks.',
        icon: <Radio size={18} />,
      },
      {
        label: 'Proof shipped',
        value: state.cards.length.toString(),
        detail: 'Portable session cards with consent snapshots.',
        icon: <CheckCircle2 size={18} />,
      },
      {
        label: 'Growth',
        value: state.socialDrafts.length.toString(),
        detail: `${draftsWaiting} draft${draftsWaiting === 1 ? '' : 's'} waiting for review.`,
        icon: <TrendingUp size={18} />,
      },
    ],
  }
}

function sumFocus(sessions: SessionRow[]) {
  return sessions.reduce((total, session) => total + (session.focus_minutes ?? 0), 0)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

async function loadDashboard(): Promise<DashboardState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { kind: 'not_configured' }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { kind: 'signed_out' }

    const { data: clubs, error: clubsError } = await supabase
      .from('clubs')
      .select('*')
      .eq('opener_id', user.id)
      .order('created_at', { ascending: false })

    if (clubsError) return { kind: 'error', message: clubsError.message }

    const clubRows = (clubs ?? []) as ClubRow[]
    const clubIds = clubRows.map((club) => club.id)

    const [sessionsResult, cardsResult, agentRunsResult, socialDraftsResult, exportsResult] =
      await Promise.all([
        clubIds.length > 0
          ? supabase
              .from('sessions')
              .select('*')
              .in('club_id', clubIds)
              .order('started_at', { ascending: false })
              .limit(40)
          : Promise.resolve({ data: [], error: null }),
        clubIds.length > 0
          ? supabase
              .from('session_cards')
              .select('*')
              .in('club_id', clubIds)
              .order('created_at', { ascending: false })
              .limit(40)
          : Promise.resolve({ data: [], error: null }),
        supabase
          .from('agent_runs')
          .select('*')
          .eq('actor_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(40),
        supabase
          .from('social_drafts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(40),
        supabase
          .from('data_exports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

    const sessionRows = (sessionsResult.data ?? []) as SessionRow[]
    const sessionIds = sessionRows.map((session) => session.id)
    const participantsResult =
      sessionIds.length > 0
        ? await supabase.from('session_participants').select('*').in('session_id', sessionIds)
        : { data: [], error: null }

    const firstError =
      sessionsResult.error ??
      cardsResult.error ??
      agentRunsResult.error ??
      socialDraftsResult.error ??
      exportsResult.error ??
      participantsResult.error

    if (firstError) return { kind: 'error', message: firstError.message }

    return {
      kind: 'ready',
      clubs: clubRows,
      sessions: sessionRows,
      participants: (participantsResult.data ?? []) as SessionParticipantRow[],
      cards: (cardsResult.data ?? []) as SessionCardRow[],
      agentRuns: (agentRunsResult.data ?? []) as AgentRunRow[],
      socialDrafts: (socialDraftsResult.data ?? []) as SocialDraftRow[],
      exports: (exportsResult.data ?? []) as DataExportRow[],
    }
  } catch (error) {
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'Unknown cockpit error.',
    }
  }
}
