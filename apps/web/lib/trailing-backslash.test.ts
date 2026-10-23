import { describe, expect, it } from 'vitest'
import { stripTrailingBackslashes } from './trailing-backslash'

describe('stripTrailingBackslashes', () => {
  it.each([
    ['/api/og%5C', '/api/og'],
    ['/api/og%5c', '/api/og'],
    ['/api/og\\', '/api/og'],
    ['/api/og%5C%5C', '/api/og'],
    ['/%5C', '/'],
  ])('strips trailing backslashes from %s', (input, expected) => {
    expect(stripTrailingBackslashes(input)).toBe(expected)
  })

  const clean = ['/api/og', '/api/og/', '/club/lofi', '/api/og%5Cx']

  it.each(clean)('leaves clean paths alone: %s', (input) => {
    expect(stripTrailingBackslashes(input)).toBeNull()
  })
})
