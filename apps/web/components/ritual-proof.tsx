'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPomodoro, sequenceForPreset, type Pomodoro } from '@vibeclubs/pomodoro-sync'
import { renderSessionCardSVG } from '@vibeclubs/session-card'
import { buildDeterministicRecap, slugifyVibeclub } from '@/lib/ritual-proof'
import { Button, Input, Textarea } from '@/components/ui'

type Stage = 'host' | 'join' | 'focus' | 'ship' | 'recap'

const stageOrder: Stage[] = ['host', 'join', 'focus', 'ship', 'recap']

export function RitualProof() {
  const [stage, setStage] = useState<Stage>('host')
  const [clubName, setClubName] = useState('Ship Night')
  const [shipTarget, setShipTarget] = useState('finish one visible piece of work')
  const [shipped, setShipped] = useState('')
  const [remainingMs, setRemainingMs] = useState(6000)
  const timerRef = useRef<Pomodoro | null>(null)

  const invite = `vibeclubs.ai/local/${slugifyVibeclub(clubName)}`
  const proofSequence = sequenceForPreset('vibe_coding_sprint')
  const proofStages = proofSequence.filter((item) => item.phase === 'focus' || item.phase === 'ship')

  const recap = useMemo(
    () =>
      buildDeterministicRecap({
        clubName: clubName.trim() || 'New Vibeclub',
        crewCount: 2,
        shipTarget: shipTarget.trim() || 'move one piece of work',
        shipped: shipped.trim() || 'one visible artifact',
      }),
    [clubName, shipTarget, shipped],
  )

  const cardUrl = useMemo(() => {
    if (stage !== 'recap') return ''
    const svg = renderSessionCardSVG({
      clubName: clubName.trim() || 'New Vibeclub',
      handle: 'local proof',
      durationMinutes: 1,
      pomodoroCycles: 1,
      platform: 'other',
      date: new Date(),
    })
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }, [clubName, stage])

  useEffect(() => {
    return () => timerRef.current?.dispose()
  }, [])

  function createInvite() {
    if (!clubName.trim() || !shipTarget.trim()) return
    setStage('join')
  }

  function startProof() {
    timerRef.current?.dispose()
    const timer = createPomodoro({
      clubId: `local-${slugifyVibeclub(clubName)}`,
      preset: 'custom',
      custom: { focus: 0.1, break: 0.05 },
      identity: 'local-host',
    })
    timer.on<number>('tick', setRemainingMs)
    timer.on('complete', () => setStage('ship'))
    timerRef.current = timer
    setRemainingMs(6000)
    setStage('focus')
    timer.start()
  }

  function resetProof() {
    timerRef.current?.dispose()
    timerRef.current = null
    setShipped('')
    setRemainingMs(6000)
    setStage('host')
  }

  const seconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const stageIndex = stageOrder.indexOf(stage)

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d15] shadow-[0_32px_100px_rgba(0,0,0,.4)]">
      <div className="grid border-b border-white/8 md:grid-cols-5">
        {stageOrder.map((item, index) => (
          <div
            key={item}
            className={`border-white/8 px-5 py-4 md:border-r md:last:border-0 ${
              index <= stageIndex ? 'bg-amber-300/[0.06] text-amber-200' : 'text-white/32'
            }`}
          >
            <span className="mr-2 font-mono text-[10px]">0{index + 1}</span>
            <span className="text-xs font-medium uppercase tracking-[.13em]">{item}</span>
          </div>
        ))}
      </div>

      <div className="grid min-h-[520px] lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-white/8 p-7 lg:border-b-0 lg:border-r lg:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-white/38">
            Local proof · no data sent
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
            {stage === 'host' && 'Name the work.'}
            {stage === 'join' && 'Bring in the crew.'}
            {stage === 'focus' && 'Lock in.'}
            {stage === 'ship' && 'Mark what moved.'}
            {stage === 'recap' && 'Keep the proof.'}
          </h3>
          <p className="mt-4 max-w-md leading-7 text-white/52">
            {stage === 'host' && 'A useful vibeclub begins with one concrete ship target.'}
            {stage === 'join' && 'This tab models a host plus one crew mate. No network room is created.'}
            {stage === 'focus' && 'The real timer engine is running a six-second inspection cycle.'}
            {stage === 'ship' && 'A recap is only credible when it names the artifact that changed.'}
            {stage === 'recap' && 'The recap text and SVG card are deterministic and generated in this tab.'}
          </p>

          <div className="mt-9 rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-white/35">
              Full sprint choreography
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {proofStages.map((item, index) => (
                <span
                  key={`${item.phase}-${index}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/52"
                >
                  {item.phase} · {item.durationSec / 60}m
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5 text-sm leading-6 text-emerald-100/68">
            AI recap is off in this proof. In the hosted path, the host must deliberately enable it
            and tell the crew before the clock starts.
          </div>
        </div>

        <div className="flex items-center p-7 lg:p-10">
          <div className="w-full">
            {stage === 'host' && (
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  createInvite()
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Vibeclub name</span>
                  <Input value={clubName} onChange={(event) => setClubName(event.target.value)} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">What will you ship?</span>
                  <Input
                    value={shipTarget}
                    onChange={(event) => setShipTarget(event.target.value)}
                  />
                </label>
                <Button type="submit" size="lg" disabled={!clubName.trim() || !shipTarget.trim()}>
                  Create local invite →
                </Button>
              </form>
            )}

            {stage === 'join' && (
              <div>
                <p className="text-sm text-white/45">Local invite</p>
                <div className="mt-2 rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-sm text-amber-200 break-all">
                  {invite}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5">
                    <span className="block h-2 w-2 rounded-full bg-emerald-300" />
                    <p className="mt-3 font-medium">Host ready</p>
                    <p className="mt-1 text-sm text-white/42">This browser</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5">
                    <span className="block h-2 w-2 rounded-full bg-emerald-300" />
                    <p className="mt-3 font-medium">Crew joined</p>
                    <p className="mt-1 text-sm text-white/42">Local proof mate</p>
                  </div>
                </div>
                <Button className="mt-7" size="lg" onClick={startProof}>
                  Start 6-second focus →
                </Button>
              </div>
            )}

            {stage === 'focus' && (
              <div className="text-center" aria-live="polite">
                <p className="font-mono text-xs uppercase tracking-[.2em] text-emerald-300">
                  Focus running
                </p>
                <p className="mt-5 font-mono text-8xl font-semibold tabular-nums tracking-[-0.06em] text-white">
                  00:{seconds.toString().padStart(2, '0')}
                </p>
                <p className="mx-auto mt-6 max-w-md text-white/48">{shipTarget}</p>
                <Button className="mt-8" variant="ghost" onClick={() => setStage('ship')}>
                  Move to ship checkpoint
                </Button>
              </div>
            )}

            {stage === 'ship' && (
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (shipped.trim()) setStage('recap')
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">What actually shipped?</span>
                  <Textarea
                    rows={4}
                    placeholder="A link, artifact, decision, or concrete change"
                    value={shipped}
                    onChange={(event) => setShipped(event.target.value)}
                  />
                </label>
                <Button type="submit" size="lg" disabled={!shipped.trim()}>
                  Create local recap →
                </Button>
              </form>
            )}

            {stage === 'recap' && (
              <div>
                <p className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 leading-7 text-white/72">
                  {recap}
                </p>
                {/* The renderer produces the exact downloadable proof asset. */}
                <img
                  className="mt-5 w-full rounded-2xl border border-white/10"
                  src={cardUrl}
                  alt={`Recap card for ${clubName}`}
                  width={1200}
                  height={630}
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={cardUrl}
                    download={`${slugifyVibeclub(clubName)}-recap.svg`}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-amber-400 px-6 text-sm font-medium text-black hover:bg-amber-300"
                  >
                    Download SVG card
                  </a>
                  <Button variant="outline" size="lg" onClick={resetProof}>
                    Run again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
