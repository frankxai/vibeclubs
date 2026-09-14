import { describe, expect, it } from 'vitest'
import { templateFromPreset } from './schema'
import {
  focusMinutesAt,
  nextBoundaryAt,
  pausedMsBefore,
  timelineFromTemplate,
  timerStateAt,
  type PauseInterval,
} from './timer'

const START = 1_800_000_000_000
const classic = templateFromPreset('25_5', 'Classic')
const sprint = templateFromPreset('vibe_coding_sprint', 'Sprint', false)

const line = (pauses: PauseInterval[] = []) => timelineFromTemplate(classic, START, pauses)
const min = (n: number) => n * 60_000

describe('timerStateAt', () => {
  it('is scheduled before the shared start epoch', () => {
    const state = timerStateAt(line(), START - 30_000)
    expect(state.status).toBe('scheduled')
    expect(state.remainingMs).toBe(30_000)
    expect(state.phase).toBeNull()
  })

  it('resolves the phase from the start epoch alone', () => {
    expect(timerStateAt(line(), START).phase).toBe('focus')
    expect(timerStateAt(line(), START + min(24)).phase).toBe('focus')
    expect(timerStateAt(line(), START + min(25)).phase).toBe('break')
    expect(timerStateAt(line(), START + min(29)).phase).toBe('break')
  })

  it('loops a looping template and counts cycles', () => {
    const state = timerStateAt(line(), START + min(65))
    expect(state.cycle).toBe(2)
    expect(state.phase).toBe('focus')
    expect(state.focusCompleted).toBe(2)
  })

  it('ends a non-looping template instead of restarting it', () => {
    const timeline = timelineFromTemplate(sprint, START)
    const totalSec = sprint.phases.reduce((s, p) => s + p.seconds, 0)
    const state = timerStateAt(timeline, START + totalSec * 1000 + 5_000)
    expect(state.status).toBe('ended')
    expect(state.focusCompleted).toBe(3)
  })

  // The whole point of a pure state machine: no accumulation, so no drift.
  it('gives one answer regardless of how many times it was called', () => {
    const timeline = line()
    const target = START + min(137) + 4_321
    for (let t = START; t < target; t += 997) timerStateAt(timeline, t)
    const stepped = timerStateAt(timeline, target)
    const cold = timerStateAt(timelineFromTemplate(classic, START), target)
    expect(stepped).toEqual(cold)
  })

  it('agrees with a client that was offline across several phases', () => {
    const timeline = line()
    const late = timerStateAt(timeline, START + min(58))
    expect(late.phase).toBe('break')
    expect(late.cycle).toBe(1)
    expect(late.remainingMs).toBe(min(2))
  })

  it('freezes the clock while paused and resumes where it stopped', () => {
    const pauses: PauseInterval[] = [{ pausedAtMs: START + min(10), resumedAtMs: null }]
    const paused = timerStateAt(line(pauses), START + min(40))
    expect(paused.status).toBe('paused')
    expect(paused.phase).toBe('focus')
    expect(paused.elapsedInPhaseMs).toBe(min(10))

    const resumed: PauseInterval[] = [{ pausedAtMs: START + min(10), resumedAtMs: START + min(40) }]
    const after = timerStateAt(line(resumed), START + min(41))
    expect(after.status).toBe('running')
    expect(after.elapsedInPhaseMs).toBe(min(11))
  })

  it('is unaffected by the order or overlap of relayed pause intervals', () => {
    const ordered: PauseInterval[] = [
      { pausedAtMs: START + min(5), resumedAtMs: START + min(8) },
      { pausedAtMs: START + min(12), resumedAtMs: START + min(15) },
    ]
    const messy: PauseInterval[] = [
      { pausedAtMs: START + min(12), resumedAtMs: START + min(15) },
      { pausedAtMs: START + min(6), resumedAtMs: START + min(8) },
      { pausedAtMs: START + min(5), resumedAtMs: START + min(7) },
    ]
    expect(timerStateAt(line(messy), START + min(40))).toEqual(
      timerStateAt(line(ordered), START + min(40)),
    )
  })

  it('counts paused time only inside the window that already elapsed', () => {
    const pauses: PauseInterval[] = [{ pausedAtMs: START + min(50), resumedAtMs: START + min(60) }]
    expect(pausedMsBefore(pauses, START, START + min(20))).toBe(0)
    expect(pausedMsBefore(pauses, START, START + min(55))).toBe(min(5))
  })

  it('reports the next boundary so a UI can sleep instead of tick', () => {
    expect(nextBoundaryAt(line(), START + min(1))).toBe(START + min(25))
    expect(nextBoundaryAt(line(), START - 1_000)).toBeNull()
  })
})

describe('focusMinutesAt', () => {
  it('counts focus time only, excluding breaks and pauses', () => {
    expect(focusMinutesAt(line(), START + min(28))).toBe(25)
    const pauses: PauseInterval[] = [{ pausedAtMs: START + min(5), resumedAtMs: START + min(15) }]
    expect(focusMinutesAt(line(pauses), START + min(20))).toBe(10)
  })
})
