'use client'

import { useEffect, useState, useTransition } from 'react'
import type { Route } from 'next'
import { useSearchParams } from 'next/navigation'
import { Pause, Play, RotateCcw, Save, SkipForward, Square } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardEyebrow,
  CardTitle,
  Field,
  Input,
  Select,
  Textarea,
  TimerDisplay,
  toast,
} from '@/components/ui'

type Phase = 'idle' | 'focus' | 'break' | 'done'

const PRESETS = [
  { value: '25_5', label: '25 / 5', focus: 25, break: 5, cycles: 2 },
  { value: '50_10', label: '50 / 10', focus: 50, break: 10, cycles: 1 },
  { value: '90_20', label: '90 / 20', focus: 90, break: 20, cycles: 1 },
  { value: 'lightning', label: 'Lightning', focus: 10, break: 2, cycles: 5 },
]

export function LockInClient() {
  const searchParams = useSearchParams()
  const firstPreset = PRESETS[0]!
  const [preset, setPreset] = useState(firstPreset.value)
  const [focusMinutes, setFocusMinutes] = useState(firstPreset.focus)
  const [breakMinutes, setBreakMinutes] = useState(firstPreset.break)
  const [cyclesGoal, setCyclesGoal] = useState(firstPreset.cycles)
  const [clubId, setClubId] = useState(searchParams.get('club_id') ?? '')
  const [task, setTask] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(firstPreset.focus * 60)
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [completedFocus, setCompletedFocus] = useState(0)
  const [completedBreak, setCompletedBreak] = useState(0)
  const [cyclesDone, setCyclesDone] = useState(0)
  const [consent, setConsent] = useState({
    witness: false,
    recap: false,
    card: true,
    social: false,
  })
  const [needsSignin, setNeedsSignin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1
        setRunning(false)
        return 0
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const activeTargetSeconds = phase === 'break' ? breakMinutes * 60 : focusMinutes * 60
  const elapsedActiveMinutes =
    phase === 'focus' || phase === 'break'
      ? Math.max(0, Math.ceil((activeTargetSeconds - remaining) / 60))
      : 0
  const focusTotal = completedFocus + (phase === 'focus' ? elapsedActiveMinutes : 0)
  const breakTotal = completedBreak + (phase === 'break' ? elapsedActiveMinutes : 0)
  const mmss = formatTime(remaining)

  function startFocus() {
    setSavedId(null)
    setError(null)
    if (!startedAt) setStartedAt(new Date().toISOString())
    if (phase !== 'focus') {
      setPhase('focus')
      setRemaining(Math.max(60, focusMinutes * 60))
    }
    setRunning(true)
  }

  function applyPreset(value: string) {
    const next = PRESETS.find((item) => item.value === value) ?? firstPreset
    setPreset(next.value)
    setFocusMinutes(next.focus)
    setBreakMinutes(next.break)
    setCyclesGoal(next.cycles)
    if (phase === 'idle') setRemaining(next.focus * 60)
  }

  function toggleRunning() {
    if (phase === 'idle' || phase === 'done') {
      startFocus()
      return
    }
    setRunning((value) => !value)
  }

  function completeFocus() {
    if (phase !== 'focus') return
    const minutes = Math.max(1, elapsedActiveMinutes || focusMinutes)
    const nextCycles = cyclesDone + 1
    setCompletedFocus((value) => value + minutes)
    setCyclesDone(nextCycles)
    setRunning(false)
    if (nextCycles >= cyclesGoal) {
      setPhase('done')
      setRemaining(0)
      return
    }
    setPhase('break')
    setRemaining(Math.max(0, breakMinutes * 60))
  }

  function completeBreak() {
    if (phase !== 'break') return
    setCompletedBreak((value) => value + Math.max(0, elapsedActiveMinutes || breakMinutes))
    setRunning(false)
    setPhase('focus')
    setRemaining(Math.max(60, focusMinutes * 60))
  }

  function resetBlock() {
    setPhase('idle')
    setRunning(false)
    setRemaining(Math.max(60, focusMinutes * 60))
    setStartedAt(null)
    setCompletedFocus(0)
    setCompletedBreak(0)
    setCyclesDone(0)
    setError(null)
    setSavedId(null)
    setNeedsSignin(false)
  }

  function saveSession() {
    setError(null)
    setNeedsSignin(false)
    const focus = Math.min(1440, Math.max(0, focusTotal || completedFocus))
    if (!startedAt || focus <= 0) {
      setError('Start a block before saving it.')
      return
    }

    startTransition(async () => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          club_id: clubId.trim() ? clubId.trim() : null,
          platform_used: 'other',
          started_at: startedAt,
          ended_at: new Date().toISOString(),
          focus_minutes: focus,
          break_minutes: Math.min(1440, Math.max(0, breakTotal)),
          pomodoro_cycles: Math.min(100, Math.max(0, cyclesDone || (phase === 'done' ? 1 : 0))),
          consent,
          metadata: {
            source: 'web_lock_in',
            task: task.trim() || null,
            cycles_goal: cyclesGoal,
            saved_from: location.pathname,
          },
        }),
      })

      const body = (await response.json().catch(() => ({}))) as { id?: string; error?: string }
      if (!response.ok) {
        if (response.status === 401) {
          setNeedsSignin(true)
          setError('Sign in to save this block to your export and host cockpit.')
          return
        }
        setError(body.error ?? 'Could not save the block.')
        return
      }

      setSavedId(body.id ?? 'saved')
      toast.success('Block saved')
    })
  }

  return (
    <div className="grid xl:grid-cols-[1fr_0.86fr] gap-4 items-start">
      <Card pad="xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardEyebrow>Web lock-in</CardEyebrow>
            <CardTitle as="h2" className="text-2xl">
              Timer and proof logger.
            </CardTitle>
          </div>
          <Badge tone={phase === 'focus' ? 'signal' : phase === 'break' ? 'violet' : 'outline'}>
            {phase}
          </Badge>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/25 p-8 text-center">
          <TimerDisplay
            mmss={mmss}
            phase={phase === 'break' ? 'break' : phase === 'focus' ? 'focus' : 'idle'}
            size="lg"
            className="min-h-[5.5rem]"
          />
          <div className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-white/35">
            {focusTotal}m focus logged · {cyclesDone}/{cyclesGoal} cycles
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={toggleRunning}
            size="lg"
            variant={running ? 'secondary' : 'primary'}
            leading={running ? <Pause size={16} /> : <Play size={16} />}
          >
            {running ? 'Pause' : phase === 'idle' || phase === 'done' ? 'Start focus' : 'Resume'}
          </Button>
          <Button
            type="button"
            onClick={completeFocus}
            size="lg"
            variant="outline"
            disabled={phase !== 'focus'}
            leading={<Square size={16} />}
          >
            Finish focus
          </Button>
          <Button
            type="button"
            onClick={completeBreak}
            size="lg"
            variant="ghost"
            disabled={phase !== 'break'}
            leading={<SkipForward size={16} />}
          >
            End break
          </Button>
          <Button
            type="button"
            onClick={resetBlock}
            size="lg"
            variant="ghost"
            leading={<RotateCcw size={16} />}
          >
            Reset
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card pad="lg">
          <CardEyebrow>Setup</CardEyebrow>
          <div className="space-y-5">
            <Field label="Rhythm">
              <Select
                value={preset}
                onChange={applyPreset}
                options={PRESETS.map((item) => ({ value: item.value, label: item.label }))}
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Focus">
                <Input
                  type="number"
                  min={1}
                  max={1440}
                  value={focusMinutes}
                  onChange={(event) => setFocusMinutes(safeInt(event.target.value, 25))}
                />
              </Field>
              <Field label="Break">
                <Input
                  type="number"
                  min={0}
                  max={1440}
                  value={breakMinutes}
                  onChange={(event) => setBreakMinutes(safeInt(event.target.value, 5))}
                />
              </Field>
              <Field label="Cycles">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={cyclesGoal}
                  onChange={(event) => setCyclesGoal(safeInt(event.target.value, 1))}
                />
              </Field>
            </div>
            <Field label="Vibeclub UUID" hint="Optional. Leave blank for a solo block.">
              <Input
                value={clubId}
                onChange={(event) => setClubId(event.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
              />
            </Field>
            <Field label="What are you shipping?">
              <Textarea
                rows={3}
                value={task}
                onChange={(event) => setTask(event.target.value)}
                placeholder="Finish landing copy, fix signup bug, publish the demo."
              />
            </Field>
          </div>
        </Card>

        <Card pad="lg">
          <CardEyebrow>Consent</CardEyebrow>
          <div className="space-y-3">
            <ConsentCheck
              label="Claude may write a recap"
              checked={consent.recap}
              onChange={(value) => setConsent((current) => ({ ...current, recap: value }))}
            />
            <ConsentCheck
              label="Create a portable card"
              checked={consent.card}
              onChange={(value) => setConsent((current) => ({ ...current, card: value }))}
            />
            <ConsentCheck
              label="Draft launch posts"
              checked={consent.social}
              onChange={(value) => setConsent((current) => ({ ...current, social: value }))}
            />
            <ConsentCheck
              label="Log witness evidence"
              checked={consent.witness}
              onChange={(value) => setConsent((current) => ({ ...current, witness: value }))}
            />
          </div>
          <CardBody className="mt-4">
            These choices are saved with the block. Agents can draft, but review gates stop anything
            risky from moving without approval.
          </CardBody>
        </Card>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
            {needsSignin && (
              <a
                href={'/signin?next=/lock-in' as Route}
                className="ml-2 text-white underline underline-offset-4"
              >
                Sign in
              </a>
            )}
          </div>
        )}

        {savedId && (
          <div className="rounded-2xl border border-[#4FD18C]/30 bg-[#4FD18C]/10 px-4 py-3 text-sm text-[#B9F6D2]">
            Saved to your host cockpit and export bundle.
          </div>
        )}

        <Button
          type="button"
          size="xl"
          full
          onClick={saveSession}
          disabled={pending}
          leading={<Save size={17} />}
        >
          {pending ? 'Saving...' : 'Save block'}
        </Button>
      </div>
    </div>
  )
}

function ConsentCheck({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-amber-400"
      />
    </label>
  )
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60)
  const seconds = Math.max(0, totalSeconds) % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function safeInt(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return fallback
  return parsed
}
