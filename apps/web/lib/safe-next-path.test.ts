import { describe, expect, it } from 'vitest'
import { safeNextPath } from './safe-next-path'

describe('safeNextPath', () => {
  it('keeps local paths, query strings, and fragments', () => {
    expect(safeNextPath('/start')).toBe('/start')
    expect(safeNextPath('/club/lofi?from=signin#join')).toBe('/club/lofi?from=signin#join')
  })

  it.each([
    'https://example.com/phish',
    '//example.com/phish',
    '/\\example.com/phish',
    'javascript:alert(1)',
    ' start',
    '',
  ])('rejects an external or malformed next target: %s', (candidate) => {
    expect(safeNextPath(candidate, '/start')).toBe('/start')
  })
})
