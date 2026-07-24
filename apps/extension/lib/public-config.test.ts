import { describe, expect, it } from 'vitest'
import { readExtensionSupabaseConfig } from './public-config'

const key = 'public-anon-key'

describe('readExtensionSupabaseConfig', () => {
  it.each([
    [
      'non-HTTPS',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'http://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'credentials',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://user:secret@example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'query',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co?key=value',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'hash',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co#fragment',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'malformed',
      { PLASMO_PUBLIC_SUPABASE_URL: 'not a URL', PLASMO_PUBLIC_SUPABASE_ANON_KEY: key },
    ],
    [
      'URL whitespace',
      {
        PLASMO_PUBLIC_SUPABASE_URL: ' https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'key whitespace',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: ' key ',
      },
    ],
    ['missing URL', { PLASMO_PUBLIC_SUPABASE_ANON_KEY: key }],
    ['missing key', { PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' }],
  ] as const)('fails closed without throwing for %s configuration', (_label, environment) => {
    expect(() => readExtensionSupabaseConfig(environment)).not.toThrow()
    expect(readExtensionSupabaseConfig(environment)).toBeUndefined()
  })

  it('returns a normalized complete configuration before client creation', () => {
    expect(
      readExtensionSupabaseConfig({
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co/',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      }),
    ).toEqual({
      url: 'https://example.supabase.co',
      anonKey: key,
    })
  })
})
