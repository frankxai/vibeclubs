import type { Route } from 'next'
import type { ReactNode } from 'react'
import { ArrowLeft, Bot, FileText } from 'lucide-react'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Container, Eyebrow, PageHeader, Section } from '@/components/layout/container'
import { EmptyState } from '@/components/patterns/empty-state'
import { Badge, Card, CardBody, CardEyebrow, CardTitle, LinkButton } from '@/components/ui'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { AgentRunRow, SocialDraftRow } from '@/lib/supabase/types'
import { ReviewActions } from './review-actions'

export const metadata = {
  title: 'Host review',
  description: 'Review agent runs and launch drafts before anything risky moves.',
}

type ReviewState =
  | { kind: 'not_configured' }
  | { kind: 'signed_out' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; agentRuns: AgentRunRow[]; socialDrafts: SocialDraftRow[] }

export default async function HostReviewPage() {
  const state = await loadReviewState()

  return (
    <main className="min-h-screen">
      <Nav />
      <Section pad="md" className="pt-28">
        <Container width="2xl">
          <PageHeader
            eyebrow={<Eyebrow>Review queue</Eyebrow>}
            title={<>Approve what moves.</>}
            subtitle={
              <>
                Agents can draft and recommend. Hosts decide before risky work, launch drafts, or
                external actions move.
              </>
            }
            actions={
              <LinkButton
                href={'/host' as Route}
                variant="outline"
                size="lg"
                leading={<ArrowLeft size={16} />}
              >
                Cockpit
              </LinkButton>
            }
          />

          <div className="mt-14">
            <ReviewContent state={state} />
          </div>
        </Container>
      </Section>
      <Footer />
    </main>
  )
}

function ReviewContent({ state }: { state: ReviewState }) {
  if (state.kind === 'not_configured') {
    return (
      <EmptyState
        title="Review needs Supabase."
        description="Set Supabase env vars to inspect agent runs and drafts."
      />
    )
  }

  if (state.kind === 'signed_out') {
    return (
      <EmptyState
        title="Sign in to review."
        description="Magic link only. The queue shows work tied to your host account."
        cta={
          <LinkButton href={'/signin?next=/host/review' as Route} variant="primary" size="lg">
            Sign in
          </LinkButton>
        }
      />
    )
  }

  if (state.kind === 'error') {
    return <EmptyState title="Review queue is waiting." description={state.message} />
  }

  const hasWork = state.agentRuns.length > 0 || state.socialDrafts.length > 0
  if (!hasWork) {
    return (
      <EmptyState
        title="Nothing waiting."
        description="Agent runs and launch drafts that need host review will land here."
        cta={
          <LinkButton href="/host" variant="outline" size="lg">
            Back to cockpit
          </LinkButton>
        }
      />
    )
  }

  return (
    <div className="grid xl:grid-cols-2 gap-5 items-start">
      <section className="space-y-4">
        <SectionHeader
          icon={<Bot size={18} />}
          eyebrow="Agent runs"
          title="Risky work pauses here."
        />
        {state.agentRuns.length === 0 ? (
          <EmptyPanel text="No agent runs need review." />
        ) : (
          state.agentRuns.map((run) => (
            <Card key={run.id} pad="lg" tone={run.risk === 'sovereign' ? 'danger' : 'featured'}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardEyebrow>{run.lane}</CardEyebrow>
                  <CardTitle>{run.agent}</CardTitle>
                  <CardBody className="mt-2">{run.input_summary ?? 'No input summary.'}</CardBody>
                </div>
                <Badge tone={run.risk === 'high' || run.risk === 'sovereign' ? 'amber' : 'outline'}>
                  {run.risk}
                </Badge>
              </div>
              <div className="mt-5 grid sm:grid-cols-3 gap-2">
                <MiniFact label="action" value={run.requested_action} />
                <MiniFact label="status" value={run.status} />
                <MiniFact label="approval" value={run.approval_state} />
              </div>
              {run.output_summary && <CardBody className="mt-4">{run.output_summary}</CardBody>}
              <div className="mt-5">
                <ReviewActions id={run.id} kind="agent-run" />
              </div>
            </Card>
          ))
        )}
      </section>

      <section className="space-y-4">
        <SectionHeader
          icon={<FileText size={18} />}
          eyebrow="Drafts"
          title="Launch copy waits here."
        />
        {state.socialDrafts.length === 0 ? (
          <EmptyPanel text="No launch drafts need review." />
        ) : (
          state.socialDrafts.map((draft) => (
            <Card key={draft.id} pad="lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardEyebrow>{draft.channel}</CardEyebrow>
                  <CardTitle>Draft waiting</CardTitle>
                </div>
                <Badge tone="amber">{draft.status}</Badge>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/75 whitespace-pre-wrap">
                {draft.body}
              </div>
              <div className="mt-5">
                <ReviewActions id={draft.id} kind="social-draft" />
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  )
}

function SectionHeader({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-amber-300">
        {icon}
      </div>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
    </div>
  )
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
      <div className="truncate font-mono text-xs text-white">{value}</div>
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

async function loadReviewState(): Promise<ReviewState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { kind: 'not_configured' }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { kind: 'signed_out' }

    const [agentRunsResult, socialDraftsResult] = await Promise.all([
      supabase
        .from('agent_runs')
        .select('*')
        .eq('actor_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(60),
      supabase
        .from('social_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(60),
    ])

    const firstError = agentRunsResult.error ?? socialDraftsResult.error
    if (firstError) return { kind: 'error', message: firstError.message }

    return {
      kind: 'ready',
      agentRuns: ((agentRunsResult.data ?? []) as AgentRunRow[]).filter(
        (run) => run.approval_state === 'pending' || run.status === 'needs_review',
      ),
      socialDrafts: ((socialDraftsResult.data ?? []) as SocialDraftRow[]).filter(
        (draft) => draft.approval_required || draft.status === 'needs_review',
      ),
    }
  } catch (error) {
    return {
      kind: 'error',
      message: error instanceof Error ? error.message : 'Unknown review queue error.',
    }
  }
}
