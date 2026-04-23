/**
 * @vibeclubs/pomodoro-sync
 *
 * Pomodoro state machine + Supabase Realtime broadcast binding.
 *
 * Model:
 *   - State lives in exactly one tab per club at a time (the "host" tab).
 *     The first extension user to hit start becomes the host until they stop
 *     or their tab closes. Every other tab in the same club subscribes to
 *     broadcast events and follows along.
 *   - Broadcasts are optimistic and self-healing: a late joiner requests the
 *     current state via a ping/pong round-trip.
 *
 * This is deliberately NOT a presence-based design — Supabase presence is
 * heavier than broadcast and we don't need membership semantics, just timer
 * sync.
 *
 * Vibe mechanics (2026-04-23):
 *   - BPM is a first-class field on state. Drives shared beat visuals across
 *     surfaces. Defaults from preset; overridable per config.
 *   - Phases extended beyond focus/break to include `ship` (60s share-back
 *     moment at end of focus) and `dance` (movement break for music clubs).
 *   - New presets: `vibe_coding_sprint`, `music_jam`, `dance_break`,
 *     `lightning` — each a choreographed sequence of phases. See
 *     `docs/strategy/vibe-mechanics.md` for the design rationale.
 */

import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

export type Phase = 'idle' | 'focus' | 'break' | 'ship' | 'dance'

export type Preset =
  | '25_5'
  | '50_10'
  | '90_20'
  | 'custom'
  | 'vibe_coding_sprint'
  | 'music_jam'
  | 'dance_break'
  | 'lightning'

export interface PomodoroConfig {
  clubId: string
  preset: Preset
  custom?: { focus: number; break: number } // minutes
  cyclesBeforeLongBreak?: number
  bpm?: number
  supabase?: SupabaseClient
  identity?: string
}

export interface PomodoroState {
  phase: Phase
  cycle: number
  startedAt: number | null // epoch ms
  durationMs: number
  hostId: string | null
  bpm: number
}

type EventName = 'tick' | 'phase' | 'complete' | 'ship' | 'dance' | 'synced'
type Listener<T = unknown> = (payload: T) => void

export interface Pomodoro {
  state(): PomodoroState
  start(): void
  pause(): void
  reset(): void
  on<T = unknown>(event: EventName, listener: Listener<T>): () => void
  dispose(): void
}

/**
 * Phase sequences per preset. Each array describes one cycle of the preset;
 * the machine loops it. Values in seconds so we can express 60s ship moments
 * cleanly. Durations outside this table come from `custom` config.
 */
const PRESET_SEQUENCES: Record<Preset, Array<{ phase: Phase; durationSec: number }>> = {
  '25_5': [
    { phase: 'focus', durationSec: 25 * 60 },
    { phase: 'break', durationSec: 5 * 60 },
  ],
  '50_10': [
    { phase: 'focus', durationSec: 50 * 60 },
    { phase: 'break', durationSec: 10 * 60 },
  ],
  '90_20': [
    { phase: 'focus', durationSec: 90 * 60 },
    { phase: 'break', durationSec: 20 * 60 },
  ],
  // Sprint — three focus+ship cycles, then one long break. High stakes.
  vibe_coding_sprint: [
    { phase: 'focus', durationSec: 22 * 60 },
    { phase: 'ship', durationSec: 60 },
    { phase: 'focus', durationSec: 22 * 60 },
    { phase: 'ship', durationSec: 60 },
    { phase: 'focus', durationSec: 22 * 60 },
    { phase: 'ship', durationSec: 60 },
    { phase: 'break', durationSec: 15 * 60 },
  ],
  // Music jam — 90 minutes, a single dance break in the middle, then a long tail.
  music_jam: [
    { phase: 'focus', durationSec: 45 * 60 },
    { phase: 'dance', durationSec: 5 * 60 },
    { phase: 'focus', durationSec: 40 * 60 },
    { phase: 'ship', durationSec: 60 },
  ],
  // Dance break — alternating focus + dance, for music-producer crews.
  dance_break: [
    { phase: 'focus', durationSec: 25 * 60 },
    { phase: 'dance', durationSec: 5 * 60 },
  ],
  // Lightning — fast outputs, 5 × (10 focus + 2 ship), total ~60 min.
  lightning: [
    { phase: 'focus', durationSec: 10 * 60 },
    { phase: 'ship', durationSec: 2 * 60 },
  ],
  custom: [
    { phase: 'focus', durationSec: 25 * 60 },
    { phase: 'break', durationSec: 5 * 60 },
  ],
}

/**
 * Default BPM per preset. Surfaces that render shared beat visuals read this
 * from the state. Callers can override via `config.bpm`.
 */
const PRESET_BPM: Record<Preset, number> = {
  '25_5': 95,
  '50_10': 95,
  '90_20': 100,
  vibe_coding_sprint: 120,
  music_jam: 108,
  dance_break: 128,
  lightning: 118,
  custom: 95,
}

export function createPomodoro(config: PomodoroConfig): Pomodoro {
  const identity = config.identity ?? crypto.randomUUID()
  const listeners = new Map<EventName, Set<Listener>>()

  // Build the phase sequence for this preset, substituting custom minutes
  // when the preset is 'custom'.
  const sequence =
    config.preset === 'custom' && config.custom
      ? [
          { phase: 'focus' as const, durationSec: config.custom.focus * 60 },
          { phase: 'break' as const, durationSec: config.custom.break * 60 },
        ]
      : PRESET_SEQUENCES[config.preset]

  const state: PomodoroState = {
    phase: 'idle',
    cycle: 0,
    startedAt: null,
    durationMs: 0,
    hostId: null,
    bpm: config.bpm ?? PRESET_BPM[config.preset],
  }

  // Pointer into `sequence`. Advances after each phase completes.
  let seqIndex = 0

  let ticker: ReturnType<typeof setInterval> | null = null
  let channel: RealtimeChannel | null = null

  function emit<T>(event: EventName, payload: T) {
    listeners.get(event)?.forEach((fn) => (fn as Listener<T>)(payload))
  }

  function tick() {
    if (state.phase === 'idle' || state.startedAt == null) return
    const elapsed = Date.now() - state.startedAt
    emit<number>('tick', Math.max(0, state.durationMs - elapsed))
    if (elapsed >= state.durationMs) advancePhase()
  }

  function advancePhase() {
    // A focus completion is a cycle increment for session-card stats.
    if (state.phase === 'focus') {
      emit<number>('complete', state.cycle + 1)
      state.cycle += 1
    }

    // Fire typed events for special phases so UI surfaces can open overlays.
    if (state.phase === 'ship') emit('ship', state.cycle)
    if (state.phase === 'dance') emit('dance', state.cycle)

    seqIndex = (seqIndex + 1) % sequence.length
    const next = sequence[seqIndex]
    if (!next) return
    enterPhase(next.phase, next.durationSec * 1000)
  }

  function enterPhase(phase: Phase, durationMs: number) {
    state.phase = phase
    state.durationMs = durationMs
    state.startedAt = Date.now()
    emit('phase', { phase, cycle: state.cycle, durationMs, bpm: state.bpm })
    broadcast('state', state)
  }

  function broadcast(kind: string, payload: unknown) {
    if (!channel || state.hostId !== identity) return
    void channel.send({ type: 'broadcast', event: kind, payload })
  }

  // Realtime wiring
  if (config.supabase) {
    channel = config.supabase.channel(`club:${config.clubId}:pomodoro`, {
      config: { broadcast: { self: false } },
    })

    channel.on('broadcast', { event: 'state' }, ({ payload }) => {
      const remote = payload as PomodoroState
      // Only follow if we're not the host
      if (state.hostId === identity) return
      Object.assign(state, remote)
      emit('synced', state)
    })

    channel.on('broadcast', { event: 'ping' }, () => {
      if (state.hostId === identity) broadcast('state', state)
    })

    void channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Ask any existing host for current state
        void channel?.send({ type: 'broadcast', event: 'ping', payload: { identity } })
      }
    })
  }

  return {
    state() {
      return { ...state }
    },

    start() {
      if (state.phase !== 'idle') return
      state.hostId = identity
      seqIndex = 0
      const first = sequence[0]
      if (!first) return
      enterPhase(first.phase, first.durationSec * 1000)
      ticker = setInterval(tick, 1000)
    },

    pause() {
      if (ticker) clearInterval(ticker)
      ticker = null
      state.phase = 'idle'
      broadcast('state', state)
    },

    reset() {
      if (ticker) clearInterval(ticker)
      ticker = null
      state.phase = 'idle'
      state.cycle = 0
      state.startedAt = null
      state.durationMs = 0
      seqIndex = 0
      broadcast('state', state)
    },

    on<T>(event: EventName, listener: Listener<T>) {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(listener as Listener)
      return () => listeners.get(event)?.delete(listener as Listener)
    },

    dispose() {
      if (ticker) clearInterval(ticker)
      listeners.clear()
      if (channel && config.supabase) void config.supabase.removeChannel(channel)
    },
  }
}

/**
 * Public helper — lets consumers read the default BPM of a preset without
 * instantiating the machine. Used by session-card and suno-bridge.
 */
export function bpmForPreset(preset: Preset): number {
  return PRESET_BPM[preset]
}

/**
 * Public helper — expose the phase sequence for a preset so UIs can render
 * the full cycle structure before starting.
 */
export function sequenceForPreset(preset: Preset): Array<{ phase: Phase; durationSec: number }> {
  return [...PRESET_SEQUENCES[preset]]
}
