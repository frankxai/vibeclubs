import { describe, expect, it } from 'vitest'
import { hasHostedConfig } from './hosted-config'

describe('hasHostedConfig', () => {
  it('requires both public Supabase values', () => {
    expect(
      hasHostedConfig({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key',
      }),
    ).toBe(true)

    expect(hasHostedConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' })).toBe(false)
    expect(hasHostedConfig({ NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key' })).toBe(false)
    expect(
      hasHostedConfig({
        NEXT_PUBLIC_SUPABASE_URL: '   ',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key',
      }),
    ).toBe(false)
  })

  it.each([
    'http://example.supabase.co',
    'ftp://example.supabase.co',
    '//example.supabase.co',
    'not a URL',
    ' https://example.supabase.co',
    'https://user:secret@example.supabase.co',
    'https://example.supabase.co?key=value',
    'https://example.supabase.co#fragment',
  ])('rejects a malformed or non-HTTPS Supabase URL: %s', (url) => {
    expect(
      hasHostedConfig({
        NEXT_PUBLIC_SUPABASE_URL: url,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key',
      }),
    ).toBe(false)
  })
})
