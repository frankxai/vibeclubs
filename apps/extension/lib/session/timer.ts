/**
 * Deterministic session timer.
 *
 * There is no timer server. Every participant holds the same start epoch (it
 * travels in the invite link) and the same phase sequence (it comes from the
 * template id), so the current phase is a pure function of `now`. Two browsers
 * that never speak to each other agree, a browser that was asleep for an hour
 * agrees the moment it wakes, and a dropped connection changes nothing.
 *
 * Pauses are the only shared mutable state. They are an append-only list of
 * intervals; applying the same list to the same start epoch yields the same
 * answer everywhere, so a pause can be relayed by any transport — or by a
 * host saying "we paused at 14:03" — without a protocol.
 *
 * Nothing here accumulates. No counter is incremented on a tick, so long
 * sessions cannot drift: a tick only re-reads the clock.
 */

import type { TemplatePhase, TimerPhaseKind, Template } from './schema'

export interface PauseInterval {
  pausedAtMs: number
  /** null means still paused. */
  resumedAtMs: number | null
}

export interface Timeline {
  startEpochMs: number
  phases: readonly TemplatePhase[]
  loop: boolean
  bpm: number
  pauses: readonly PauseInterval[]
}

export type TimerStatus = 'scheduled' | 'running' | 'paused' | 'ended'

export interface TimerState {
  status: TimerStatus
  /** null while scheduled or ended. */
  phase: TimerPhaseKind | null
  phaseIndex: number
  /** Completed passes through the phase sequence. */
  cycle: number
  /** Focus phases fully elapsed so far. */
  focusCompleted: number
  /** Milliseconds left in the current phase, or until start when scheduled. */
  remainingMs: number
  elapsedInPhaseMs: number
  /** Effective elapsed time since start, excluding paused time. */
  elapsedTotalMs: number
  bpm: number
}

export function timelineFromTemplate(
  template: Template,
  startEpochMs: number,
  pauses: readonly PauseInterval[] = [],
): Timeline {
  return {
    startEpochMs,
    phases: template.phases.filter((p) => p.seconds > 0),
    loop: template.loop,
    bpm: template.bpm,
    pauses,
  }
}

/** Total length of one pass through the sequence, in ms. */
export function sequenceDurationMs(phases: readonly TemplatePhase[]): number {
  return phases.reduce((sum, p) => sum + Math.max(0, p.seconds) * 1000, 0)
}

/**
 * Paused milliseconds inside [startEpochMs, nowMs]. Overlapping or unsorted
 * intervals are tolerated by merging them first, so a relayed pause log that
 * arrived out of order still produces one answer.
 */
export function pausedMsBefore(
  pauses: readonly PauseInterval[],
  startEpochMs: number,
  nowMs: number,
): number {
  const clamped = pauses
    .map((p) => ({
      from: Math.max(startEpochMs, p.pausedAtMs),
      to: Math.min(nowMs, p.resumedAtMs ?? nowMs),
    }))
    .filter((p) => p.to > p.from)
    .sort((a, b) => a.from - b.from)

  let total = 0
  let cursor = -Infinity
  for (const span of clamped) {
    const from = Math.max(span.from, cursor)
    if (span.to > from) {
      total += span.to - from
      cursor = span.to
    }
  }
  return total
}

function isPausedAt(pauses: readonly PauseInterval[], nowMs: number): boolean {
  return pauses.some((p) => p.pausedAtMs <= nowMs && (p.resumedAtMs === null || p.resumedAtMs > nowMs))
}

/** The single source of truth for "what phase are we in". Pure. */
export function timerStateAt(timeline: Timeline, nowMs: number): TimerState {
  const { startEpochMs, phases, loop, bpm, pauses } = timeline
  const idle: TimerState = {
    status: 'ended',
    phase: null,
    phaseIndex: -1,
    cycle: 0,
    focusCompleted: 0,
    remainingMs: 0,
    elapsedInPhaseMs: 0,
    elapsedTotalMs: 0,
    bpm,
  }

  const total = sequenceDurationMs(phases)
  if (phases.length === 0 || total <= 0) return idle

  if (nowMs < startEpochMs) {
    return {
      ...idle,
      status: 'scheduled',
      remainingMs: startEpochMs - nowMs,
    }
  }

  const paused = isPausedAt(pauses, nowMs)
  // While paused, the clock is frozen at the moment the pause began.
  const effectiveNow = paused
    ? Math.max(
        ...pauses
          .filter((p) => p.pausedAtMs <= nowMs && (p.resumedAtMs === null || p.resumedAtMs > nowMs))
          .map((p) => p.pausedAtMs),
      )
    : nowMs

  const elapsed = Math.max(0, effectiveNow - startEpochMs - pausedMsBefore(pauses, startEpochMs, effectiveNow))

  if (!loop && elapsed >= total) {
    const focusTotal = phases.filter((p) => p.kind === 'focus').length
    return { ...idle, status: 'ended', cycle: 1, focusCompleted: focusTotal, elapsedTotalMs: total }
  }

  const cycle = Math.floor(elapsed / total)
  let rem = elapsed - cycle * total
  let focusCompleted = cycle * phases.filter((p) => p.kind === 'focus').length

  for (let i = 0; i < phases.length; i += 1) {
    const phase = phases[i]!
    const durationMs = phase.seconds * 1000
    if (rem < durationMs) {
      return {
        status: paused ? 'paused' : 'running',
        phase: phase.kind,
        phaseIndex: i,
        cycle,
        focusCompleted,
        remainingMs: durationMs - rem,
        elapsedInPhaseMs: rem,
        elapsedTotalMs: elapsed,
        bpm,
      }
    }
    rem -= durationMs
    if (phase.kind === 'focus') focusCompleted += 1
  }

  // Unreachable for a well-formed sequence; treated as ended rather than thrown
  // so a malformed template cannot break a live session.
  return { ...idle, cycle, focusCompleted, elapsedTotalMs: elapsed }
}

/**
 * Wall-clock instant of the next phase change, or null when scheduled/paused/
 * ended. Lets a UI sleep until the boundary instead of ticking a counter.
 */
export function nextBoundaryAt(timeline: Timeline, nowMs: number): number | null {
  const state = timerStateAt(timeline, nowMs)
  if (state.status !== 'running') return null
  return nowMs + state.remainingMs
}

/** Focus minutes actually spent, for the proof card. Excludes paused time. */
export function focusMinutesAt(timeline: Timeline, nowMs: number): number {
  const state = timerStateAt(timeline, nowMs)
  const total = sequenceDurationMs(timeline.phases)
  if (total <= 0) return 0
  const focusMsPerCycle = timeline.phases
    .filter((p) => p.kind === 'focus')
    .reduce((sum, p) => sum + p.seconds * 1000, 0)

  let ms = state.cycle * focusMsPerCycle
  let rem = state.elapsedTotalMs - state.cycle * total
  for (const phase of timeline.phases) {
    const durationMs = phase.seconds * 1000
    const spent = Math.min(rem, durationMs)
    if (spent <= 0) break
    if (phase.kind === 'focus') ms += spent
    rem -= spent
  }
  return Math.floor(ms / 60000)
}

export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const mm = Math.floor(total / 60)
  const ss = total % 60
  return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`
}
