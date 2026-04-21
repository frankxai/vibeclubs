import { describe, expect, it } from 'vitest'
import { AMBIENT_PRESETS } from './index'

describe('AMBIENT_PRESETS', () => {
  it('includes the five canonical presets', () => {
    const ids = AMBIENT_PRESETS.map((p) => p.id)
    expect(ids).toEqual(['lofi', 'rain', 'cafe', 'nature', 'space'])
  })

  it('presets have human labels', () => {
    for (const p of AMBIENT_PRESETS) {
      expect(p.label.length).toBeGreaterThan(0)
      expect(p.id).toMatch(/^[a-z]+$/)
    }
  })
})

/*
 * Note: createMixer() is not tested in unit-land because jsdom doesn't
 * implement AudioContext or MediaElementAudioSourceNode. The mixer is
 * covered by the E2E Playwright test (apps/web/tests/e2e/mixer.spec.ts).
 */
