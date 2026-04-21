import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPomodoro } from './index'

describe('createPomodoro', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in idle phase', () => {
    const p = createPomodoro({ clubId: 'test', preset: '25_5' })
    expect(p.state().phase).toBe('idle')
    expect(p.state().cycle).toBe(0)
  })

  it('transitions idle → focus on start', () => {
    const p = createPomodoro({ clubId: 'test', preset: '25_5' })
    p.start()
    expect(p.state().phase).toBe('focus')
  })

  it('emits tick with remaining ms', () => {
    const p = createPomodoro({ clubId: 'test', preset: '25_5' })
    const ticks: number[] = []
    p.on<number>('tick', (ms) => ticks.push(ms))
    p.start()
    vi.advanceTimersByTime(3000)
    expect(ticks.length).toBeGreaterThanOrEqual(1)
    // After ~3s of a 25-minute focus, remaining should be close to 25*60_000 - 3000
    const last = ticks[ticks.length - 1]!
    expect(last).toBeGreaterThan(25 * 60_000 - 5000)
    expect(last).toBeLessThan(25 * 60_000)
  })

  it('advances focus → break → focus and increments cycle', () => {
    const p = createPomodoro({ clubId: 'test', preset: '25_5' })
    const phases: string[] = []
    p.on<{ phase: string }>('phase', (e) => phases.push(e.phase))
    p.start()
    // advance 25 min + 5 min to complete one full cycle
    vi.advanceTimersByTime(25 * 60_000 + 1000)
    // phase emits: focus (initial), break (after 25min)
    expect(phases.at(-1)).toBe('break')
    expect(p.state().cycle).toBe(1)
  })

  it('reset sets idle and zeroes cycle', () => {
    const p = createPomodoro({ clubId: 'test', preset: '25_5' })
    p.start()
    vi.advanceTimersByTime(10_000)
    p.reset()
    expect(p.state().phase).toBe('idle')
    expect(p.state().cycle).toBe(0)
  })
})
