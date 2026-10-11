import { describe, expect, it } from 'vitest'
import { buildDeterministicRecap, slugifyVibeclub } from './ritual-proof'

describe('local ritual proof', () => {
  it('creates a safe invite slug', () => {
    expect(slugifyVibeclub('  Ship Night: Amsterdam! ')).toBe('ship-night-amsterdam')
    expect(slugifyVibeclub('***')).toBe('new-vibeclub')
  })

  it('creates an exact recap without an AI call', () => {
    expect(
      buildDeterministicRecap({
        clubName: 'Ship Night',
        crewCount: 2,
        shipTarget: 'finish the landing page',
        shipped: 'responsive first viewport',
      }),
    ).toBe(
      'Ship Night: 2 people locked in to finish the landing page. Shipped: responsive first viewport.',
    )
  })

  it('handles single person crew count correctly', () => {
    expect(
      buildDeterministicRecap({
        clubName: 'Solo Club',
        crewCount: 1,
        shipTarget: 'write tests',
        shipped: 'unit tests',
      }),
    ).toBe('Solo Club: 1 person locked in to write tests. Shipped: unit tests.')
  })

  it('falls back gracefully when given whitespace inputs', () => {
    expect(
      buildDeterministicRecap({
        clubName: '   ',
        crewCount: 2,
        shipTarget: '   ',
        shipped: '   ',
      }),
    ).toBe(
      'New Vibeclub: 2 people locked in to move one piece of work. Shipped: one visible artifact.',
    )
  })
})
