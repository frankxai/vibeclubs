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
      'uppercase scheme',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'HTTPS://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'uppercase host',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://EXAMPLE.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'scheme backslashes',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https:\\\\example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'path backslash',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co\\path',
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
      'empty query delimiter',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co?',
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
      'empty hash delimiter',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co#',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'path',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co/rest',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'two trailing slashes',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co//',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'empty explicit port',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co:',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'default port',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co:443',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'trailing host dot',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co.',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'unicode host normalized to punycode',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://éxample.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'percent-encoded host',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://%65xample.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'noncanonical IPv4',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://127.1',
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
      'URL tab',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.\tsupabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'URL newline',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.\nsupabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'URL carriage return',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.\rsupabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'URL non-breaking space',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.\u00a0supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'URL control',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.\u0000supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      },
    ],
    [
      'URL format control',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.\u200bsupabase.co',
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
    [
      'key internal space',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: 'public anon key',
      },
    ],
    [
      'key tab',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: 'public\tanon-key',
      },
    ],
    [
      'key newline',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: 'public\nanon-key',
      },
    ],
    [
      'key non-breaking space',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: 'public\u00a0anon-key',
      },
    ],
    [
      'key control',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: 'public\u0000anon-key',
      },
    ],
    [
      'key format control',
      {
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: 'public\u200banon-key',
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

  it('accepts the canonical origin without a trailing slash', () => {
    expect(
      readExtensionSupabaseConfig({
        PLASMO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PLASMO_PUBLIC_SUPABASE_ANON_KEY: key,
      }),
    ).toEqual({
      url: 'https://example.supabase.co',
      anonKey: key,
    })
  })
})
