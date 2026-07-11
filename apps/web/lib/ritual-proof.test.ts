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
})
