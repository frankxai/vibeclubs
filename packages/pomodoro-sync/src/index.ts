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
 */

import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

export type Phase = 'idle' | 'focus' | 'break'

export type Preset = '25_5' | '50_10' | '90_20' | 'custom'

export interface PomodoroConfig {
  clubId: string
  preset: Preset
  custom?: { focus: number; break: number } // minutes
  cyclesBeforeLongBreak?: number
  supabase?: SupabaseClient
  identity?: string
}

export interface PomodoroState {
  phase: Phase
  cycle: number
  startedAt: number | null // epoch ms
  durationMs: number
  hostId: string | null
}

type EventName = 'tick' | 'phase' | 'complete' | 'synced'
type Listener<T = unknown> = (payload: T) => void

export interface Pomodoro {
  state(): PomodoroState
  start(): void
  pause(): void
  reset(): void
  on<T = unknown>(event: EventName, listener: Listener<T>): () => void
  dispose(): void
}

const PRESET_MINUTES: Record<Preset, { focus: number; break: number }> = {
  '25_5': { focus: 25, break: 5 },
  '50_10': { focus: 50, break: 10 },
  '90_20': { focus: 90, break: 20 },
  custom: { focus: 25, break: 5 },
}

export function createPomodoro(config: PomodoroConfig): Pomodoro {
  const identity = config.identity ?? crypto.randomUUID()
  const listeners = new Map<EventName, Set<Listener>>()
  const durations = {
    focus: ((config.custom?.focus ?? PRESET_MINUTES[config.preset].focus) * 60_000) | 0,
    break: ((config.custom?.break ?? PRESET_MINUTES[config.preset].break) * 60_000) | 0,
  }

  const state: PomodoroState = {
    phase: 'idle',
    cycle: 0,
    startedAt: null,
    durationMs: 0,
    hostId: null,
  }

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
    if (state.phase === 'focus') {
      emit<number>('complete', state.cycle + 1)
      state.cycle += 1
      enterPhase('break', durations.break)
    } else if (state.phase === 'break') {
      enterPhase('focus', durations.focus)
    }
  }

  function enterPhase(phase: Phase, durationMs: number) {
    state.phase = phase
    state.durationMs = durationMs
    state.startedAt = Date.now()
    emit('phase', { phase, cycle: state.cycle, durationMs })
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
      enterPhase('focus', durations.focus)
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
