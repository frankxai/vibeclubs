import { describe, expect, it } from 'vitest'
import { detectMilestone, witnessPrompt } from './index'

describe('witnessPrompt', () => {
  it('produces a system + user prompt pair', () => {
    const out = witnessPrompt({ type: 'pomodoro_start', cycle_number: 1 })
    expect(out.system).toContain('Vibeclubs witness')
    expect(out.user).toContain('pomodoro_start')
  })

  it('explicitly forbids interrupting in the system prompt', () => {
    const { system } = witnessPrompt({ type: 'session_start' })
    // This is load-bearing behaviour per VISION.md philosophy rule #4.
    expect(system).toMatch(/NEVER/)
    expect(system).toMatch(/Never|interrupt/i)
  })

  it('session_end asks for 1-2 sentence summary', () => {
    const { user } = witnessPrompt({
      type: 'session_end',
      cycle_number: 3,
      focus_minutes_so_far: 90,
    })
    expect(user).toContain('session_end')
    expect(user).toMatch(/summary/i)
  })

  it('caps output length in system prompt', () => {
    const { system } = witnessPrompt({ type: 'pomodoro_complete', cycle_number: 2 })
    expect(system).toMatch(/under \d+ words/i)
  })
})

describe('detectMilestone', () => {
  it('flags first session', () => {
    expect(
      detectMilestone({ totalSessions: 1, cyclesThisSession: 1, totalFocusMinutesAllTime: 25 }),
    ).toBe('first session')
  })

  it('flags 5th cycle in a session', () => {
    expect(
      detectMilestone({ totalSessions: 3, cyclesThisSession: 5, totalFocusMinutesAllTime: 250 }),
    ).toBe('5th cycle in a session')
  })

  it('returns null when nothing notable happened', () => {
    expect(
      detectMilestone({ totalSessions: 2, cyclesThisSession: 2, totalFocusMinutesAllTime: 50 }),
    ).toBeNull()
  })

  it('flags 10-session streaks', () => {
    expect(
      detectMilestone({ totalSessions: 10, cyclesThisSession: 1, totalFocusMinutesAllTime: 1 }),
    ).toBe('10-session streak')
  })
})
