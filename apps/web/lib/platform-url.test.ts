import { describe, expect, it } from 'vitest'
import { getSafePlatformLink } from './platform-url'

describe('getSafePlatformLink', () => {
  it('accepts HTTPS links and exposes the parsed hostname', () => {
    expect(getSafePlatformLink('https://discord.gg/vibe')).toEqual({
      href: 'https://discord.gg/vibe',
      hostname: 'discord.gg',
    })
  })

  it.each([
    null,
    '',
    'not a url',
    'javascript:alert(1)',
    'data:text/html,unsafe',
    'http://example.com/invite',
    'https://user:password@example.com/invite',
  ])('fails closed for unsafe or malformed input: %s', (value) => {
    expect(getSafePlatformLink(value)).toBeNull()
  })

  it('normalizes the hostname before displaying the destination', () => {
    expect(getSafePlatformLink('https://EXAMPLE.COM./invite')?.hostname).toBe('example.com')
  })
})
