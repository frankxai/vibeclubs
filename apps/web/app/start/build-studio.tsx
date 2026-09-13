'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import * as Tabs from '@radix-ui/react-tabs'
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  Headphones,
  PenLine,
  Shapes,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react'
import { Button, Field, Input, Textarea, LinkButton } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  BuildDraftSchema,
  DEFAULT_DRAFT,
  TRACKS,
  buildPack,
  type BuildDraft,
} from '@/lib/build-pack'
import { findTemplate } from '@/lib/club-templates'

const ICONS = {
  coding: Code2,
  agents: Workflow,
  design: Shapes,
  music: Headphones,
  writing: PenLine,
  mixed: Users,
}
const STORAGE_KEY = 'vc:build-pack:v1'
const SELECT = 'w-full rounded-xl border border-border bg-bg-elevated p-3 text-base'

export function BuildStudio({ aiAvailable = false }: { aiAvailable?: boolean }) {
  const [refining, setRefining] = useState(false)
  const [refined, setRefined] = useState('')
  const [aiError, setAiError] = useState('')
  const search = useSearchParams()
  const [draft, setDraft] = useState<BuildDraft>(DEFAULT_DRAFT)
  const [ready, setReady] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState('')
  const [fallback, setFallback] = useState('')
  const [tab, setTab] = useState('agenda')
  const pack = buildPack(draft)
  const valid = BuildDraftSchema.safeParse(draft).success
  const technical = ['coding', 'agents', 'design'].includes(draft.track)

  useEffect(() => {
    let initial = DEFAULT_DRAFT
    let restored = false
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      const parsed = BuildDraftSchema.safeParse(value)
      if (parsed.success) {
        initial = parsed.data
        restored = true
      }
    } catch {
      /* Private browsing or corrupt drafts must not block creation. */
    }
    const template = findTemplate(search.get('template'))
    if (template && !restored) {
      const track = TRACKS.find((item) => item.id === template.defaults.type) ?? TRACKS[5]
      initial = {
        ...initial,
        track: track.id,
        name: template.label,
        outcome: track.outcome,
        place: (
          {
            discord: 'Discord',
            meet: 'Google Meet',
            zoom: 'Zoom',
            in_person: 'In person',
            other: 'Other',
          } as const
        )[template.defaults.platform],
        soundtrack:
          template.defaults.ambient_preset === 'rain'
            ? 'Rain'
            : template.defaults.ambient_preset === 'lofi'
              ? 'Lo-fi'
              : 'Your own music',
      }
    }
    setDraft(initial)
    setReady(true)
  }, [search])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }, [draft, ready])

  function update<K extends keyof BuildDraft>(key: K, value: BuildDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setNotice('')
    setFallback('')
    setRefined('')
    setAiError('')
  }

  function chooseTrack(track: (typeof TRACKS)[number]) {
    setDraft((current) => ({
      ...current,
      track: track.id,
      outcome: TRACKS.some((item) => item.outcome === current.outcome)
        ? track.outcome
        : current.outcome,
    }))
    setTab('agenda')
    setNotice('')
    setFallback('')
    setRefined('')
    setAiError('')
  }

  async function copy(text: string, label: string) {
    if (!valid) {
      setNotice('Add a name and a finish before copying your pack.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setNotice(`${label} copied. Ready to paste.`)
      setFallback('')
    } catch {
      setFallback(text)
      setNotice('Clipboard unavailable. Select and copy the text below.')
    }
  }

  async function refine() {
    setRefining(true)
    setAiError('')
    setRefined('')
    try {
      const response = await fetch('/api/build-brief', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
        signal: AbortSignal.timeout(25_000),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not refine this brief.')
      setRefined(
        [
          data.brief.finish,
          '',
          'Make it:',
          ...data.brief.steps,
          '',
          'Check it:',
          ...data.brief.checks,
          '',
          'Cut for now:',
          data.brief.cut,
        ].join('\n'),
      )
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Could not refine this brief.')
    } finally {
      setRefining(false)
    }
  }

  function resetDraft() {
    setDraft(DEFAULT_DRAFT)
    setRefined('')
    setAiError('')
    setFallback('')
    setTab('agenda')
    setNotice('Started a fresh draft.')
  }

  function download() {
    if (!valid) return
    const url = URL.createObjectURL(
      new Blob([pack.markdown], { type: 'text/markdown;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `${
      draft.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'vibeclub'
    }-host-pack.md`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Host pack downloaded. Share it when you are ready.')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <div className="min-w-0 space-y-8">
        <fieldset disabled={refining}>
          <legend className="mb-4 flex items-center gap-3 text-lg font-medium">
            <span className="font-mono text-sm text-vibe-amber">01</span> What are you making?
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {TRACKS.map((track) => {
              const Icon = ICONS[track.id]
              const active = draft.track === track.id
              return (
                <button
                  key={track.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseTrack(track)}
                  className={cn(
                    'relative rounded-2xl border p-4 text-left transition-colors motion-reduce:transition-none',
                    active
                      ? 'border-vibe-amber bg-vibe-amber/10'
                      : 'border-border bg-surface-1 hover:border-border-strong hover:bg-surface-3',
                  )}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        'h-5 w-5',
                        active ? 'text-vibe-amber-soft' : 'text-text-secondary',
                      )}
                    />
                    {active && <Check aria-hidden="true" className="h-4 w-4 text-vibe-amber" />}
                  </div>
                  <div className="font-medium">{track.label}</div>
                  <div className="mt-1 text-sm leading-5 text-text-secondary">{track.verb}</div>
                </button>
              )
            })}
          </div>
        </fieldset>
        <section className="space-y-4" aria-labelledby="finish-title">
          <h2 id="finish-title" className="flex items-center gap-3 text-lg font-medium">
            <span className="font-mono text-sm text-vibe-amber">02</span> Give it a finish line.
          </h2>
          <Field label="Name your vibeclub" htmlFor="club-name">
            <Input
              disabled={refining}
              id="club-name"
              maxLength={80}
              className="text-base"
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
            />
          </Field>
          <Field label="By the end, we will have…" htmlFor="club-outcome">
            <Textarea
              disabled={refining}
              id="club-outcome"
              maxLength={500}
              rows={3}
              className="text-base"
              value={draft.outcome}
              onChange={(event) => update('outcome', event.target.value)}
            />
          </Field>
          <p className="text-sm leading-6 text-text-secondary">
            One reachable finish each. A working flow, a better draft, a track worth playing.
          </p>
        </section>
        <section className="space-y-4" aria-labelledby="rhythm-title">
          <h2 id="rhythm-title" className="flex items-center gap-3 text-lg font-medium">
            <span className="font-mono text-sm text-vibe-amber">03</span> Set the rhythm.
          </h2>
          <fieldset disabled={refining}>
            <legend className="mb-2 text-sm font-medium">Total time, including breaks</legend>
            <div className="grid grid-cols-3 gap-2">
              {([60, 90, 120] as const).map((duration) => (
                <button
                  key={duration}
                  type="button"
                  aria-pressed={draft.duration === duration}
                  onClick={() => update('duration', duration)}
                  className={cn(
                    'rounded-xl border py-3 font-mono text-sm',
                    draft.duration === duration
                      ? 'border-vibe-amber bg-vibe-amber/10 text-vibe-amber-soft'
                      : 'border-border text-text-secondary',
                  )}
                >
                  {duration} min
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Crew size" htmlFor="club-crew">
              <select
                disabled={refining}
                id="club-crew"
                className={SELECT}
                value={draft.crew}
                onChange={(event) => update('crew', Number(event.target.value))}
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} people
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Where you meet" htmlFor="club-place">
              <select
                disabled={refining}
                id="club-place"
                className={SELECT}
                value={draft.place}
                onChange={(event) => update('place', event.target.value as BuildDraft['place'])}
              >
                {['Discord', 'Google Meet', 'Zoom', 'In person', 'Other'].map((place) => (
                  <option key={place}>{place}</option>
                ))}
              </select>
            </Field>
            <Field label="Soundtrack" htmlFor="club-sound">
              <select
                disabled={refining}
                id="club-sound"
                className={SELECT}
                value={draft.soundtrack}
                onChange={(event) =>
                  update('soundtrack', event.target.value as BuildDraft['soundtrack'])
                }
              >
                {['Lo-fi', 'Rain', 'Your own music', 'Silence'].map((sound) => (
                  <option key={sound}>{sound}</option>
                ))}
              </select>
            </Field>
            <Field label="When + timezone (optional)" htmlFor="club-when">
              <Input
                disabled={refining}
                id="club-when"
                className="text-base"
                maxLength={120}
                placeholder="Thu 19:00 Amsterdam"
                value={draft.when}
                onChange={(event) => update('when', event.target.value)}
              />
            </Field>
          </div>
          <p className="text-sm leading-6 text-text-secondary">
            Keep call links and addresses in your crew chat. Your music plays in your own tools.
          </p>
        </section>
      </div>
      <aside className="min-w-0" aria-label="Your host pack">
        <div className="overflow-hidden rounded-3xl border border-border-strong bg-bg-elevated lg:sticky lg:top-24">
          <div className="border-b border-border bg-vibe-amber/5 p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-vibe-amber-soft">
                Your host pack
              </span>
              <span className="text-xs text-text-secondary">
                {saved ? 'Saved on this device' : 'Private draft'}
              </span>
            </div>
            <h2 className="break-words text-3xl font-semibold tracking-tight">
              {draft.name || 'Name your vibeclub'}
            </h2>
            <p className="mt-3 break-words leading-7 text-text-secondary">
              {draft.outcome || 'Choose something to finish.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {[`${draft.duration} minutes`, `${draft.crew} people`, draft.place].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-bg-base px-3 py-1.5"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List
              aria-label="Host pack contents"
              className="flex border-b border-border px-4 pt-2"
            >
              {[
                ['agenda', 'The run'],
                ['brief', 'Build brief'],
                ['invite', 'Invite'],
              ].map(([value, label]) => (
                <Tabs.Trigger
                  key={value}
                  value={value!}
                  className="flex-1 border-b-2 border-transparent px-2 py-3 text-sm text-text-secondary data-[state=active]:border-vibe-amber data-[state=active]:text-vibe-amber-soft"
                >
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="agenda" className="p-6 sm:p-8">
              <ol className="space-y-5">
                {pack.agenda.map((phase, i) => (
                  <li key={phase.name} className="grid grid-cols-[4rem_1fr] gap-4">
                    <span className="pt-1 font-mono text-sm text-text-secondary">
                      {phase.start}–{phase.end}
                    </span>
                    <div
                      className={cn(
                        'border-l-2 pl-4',
                        i === 1 || i === 3 ? 'border-vibe-amber' : 'border-border-strong',
                      )}
                    >
                      <h3 className="font-medium">{phase.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">{phase.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-border pt-4 text-sm text-text-secondary">
                Elapsed minutes · the human host keeps the clock.
              </p>
            </Tabs.Content>
            <Tabs.Content value="brief" className="space-y-5 p-6 sm:p-8">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-vibe-amber-soft">
                  Bring your tools
                </p>
                <p className="mt-2 leading-7">{pack.track.tools}</p>
              </div>
              <div>
                <h3 className="font-medium">What counts as done</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{pack.track.proof}.</p>
              </div>
              <p className="text-sm leading-6 text-text-secondary">
                {draft.track === 'agents'
                  ? 'One task. Explicit tool access. Bounded runs. Review the failure cases before you call it done.'
                  : 'Scope it. Make it. Check it. Show the evidence. Keep the next idea for the next lock-in.'}
              </p>
              <Button
                variant="outline"
                full
                onClick={() => copy(pack.brief, 'Build brief')}
                disabled={!valid || refining}
              >
                <Copy size={16} aria-hidden="true" />
                {draft.track === 'agents' ? 'Copy agent brief' : 'Copy build brief'}
              </Button>
              {aiAvailable && (
                <div className="space-y-3 border-t border-border pt-5">
                  <p className="text-sm leading-6 text-text-secondary">
                    Send the craft, finish, and time budget to Claude for a tighter brief. Sign-in
                    required; up to 10 requests per day.
                  </p>
                  <Button variant="secondary" full disabled={!valid || refining} onClick={refine}>
                    {refining ? 'Refining…' : 'Refine with Claude'}
                  </Button>
                  {aiError.startsWith('Sign in') && (
                    <LinkButton href="/signin?next=/start" variant="outline">
                      Sign in to refine
                    </LinkButton>
                  )}
                  {aiError && (
                    <p role="alert" className="text-sm text-vibe-warning">
                      {aiError}
                    </p>
                  )}
                  {refined && (
                    <>
                      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-text-secondary">
                        {refined}
                      </pre>
                      <Button variant="outline" full onClick={() => copy(refined, 'Refined brief')}>
                        Copy refined brief
                      </Button>
                      <p className="text-sm text-text-secondary">
                        Review this suggestion before using it. Your host pack stays unchanged.
                      </p>
                    </>
                  )}
                </div>
              )}
              {technical && (
                <div className="space-y-3 border-t border-border pt-5">
                  <Button
                    variant="secondary"
                    full
                    onClick={() => copy(pack.v0, 'v0 prompt')}
                    disabled={!valid || refining}
                  >
                    <Sparkles size={16} aria-hidden="true" />
                    Copy v0 prompt
                  </Button>
                  <a
                    href="https://v0.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-vibe-amber-soft"
                  >
                    Open v0 <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <p className="text-sm leading-6 text-text-secondary">
                    Paste the prompt into v0 for a web prototype. Your editor handles the code
                    review and checks.
                  </p>
                </div>
              )}
            </Tabs.Content>
            <Tabs.Content value="invite" className="p-6 sm:p-8">
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-text-secondary">
                {pack.invite}
              </pre>
              <Button
                className="mt-5"
                variant="outline"
                full
                onClick={() => copy(pack.invite, 'Crew invite')}
                disabled={!valid || refining}
              >
                <Copy size={16} aria-hidden="true" />
                Copy crew invite
              </Button>
            </Tabs.Content>
          </Tabs.Root>
          <div className="space-y-3 border-t border-border p-6 sm:px-8">
            <Button size="lg" full onClick={download} disabled={!valid || refining}>
              <Download size={18} aria-hidden="true" />
              Download host pack
            </Button>
            <Button
              variant="ghost"
              full
              onClick={() => copy(pack.markdown, 'Host pack')}
              disabled={!valid || refining}
            >
              <Copy size={16} aria-hidden="true" />
              Copy everything
            </Button>
            <p className="text-center text-sm text-text-secondary">
              Invite, agenda, build brief, and recap prompt.
            </p>
            {!valid && (
              <p role="alert" className="text-sm text-vibe-warning">
                Add a name and a finish to export your pack.
              </p>
            )}
            <p role="status" aria-live="polite" className="text-sm leading-6 text-vibe-amber-soft">
              {notice}
            </p>
            {fallback && (
              <Field label="Copy this text" htmlFor="copy-fallback">
                <Textarea
                  id="copy-fallback"
                  readOnly
                  rows={6}
                  value={fallback}
                  onFocus={(event) => event.target.select()}
                />
              </Field>
            )}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-text-secondary">
          <Button variant="ghost" onClick={resetDraft} disabled={refining}>
            Reset draft
          </Button>
          <LinkButton href="/#try-it" variant="ghost">
            Try the local timer →
          </LinkButton>
        </div>
      </aside>
    </div>
  )
}
