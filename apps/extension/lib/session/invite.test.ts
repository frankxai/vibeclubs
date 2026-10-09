import { describe, expect, it } from 'vitest'
import { SESSION_SCHEMA_VERSION, type Session } from './schema'
import { InviteError, checksum, decodeInvite, encodeInvite, inviteUrl, tokenFromUrl } from './invite'

/** Builds a token the encoder would refuse, to exercise the decoder's guards. */
function handBuilt(overrides: Record<string, unknown>): string {
  const wire = {
    v: 1,
    i: session.id,
    f: session.formatId,
    t: session.templateId,
    e: session.startEpochMs,
    k: null,
    h: session.hostRef,
    ...overrides,
  }
  const payload = btoa(JSON.stringify(wire)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${payload}.${checksum(payload)}`
}

const session: Session = {
  schema: SESSION_SCHEMA_VERSION,
  id: 'a1b2c3d4e5f6',
  formatId: 'vibeclub',
  templateId: '25_5',
  startEpochMs: 1_800_000_000_000,
  soundtrackId: null,
  hostRef: 'f6e5d4c3b2a1',
}

describe('encodeInvite / decodeInvite', () => {
  it('round-trips a session through a URL-safe token', () => {
    const token = encodeInvite(session)
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[0-9a-f]{4}$/)
    expect(decodeInvite(token)).toEqual({ ok: true, session, errors: [] })
  })

  it('refuses to encode a field that looks like personal data', () => {
    expect(() => encodeInvite({ ...session, hostRef: 'frank@example.com' })).toThrow(InviteError)
    expect(() => encodeInvite({ ...session, id: '@frankx' })).toThrow(/handle/)
  })

  it('rejects a truncated or edited link instead of half-loading it', () => {
    const token = encodeInvite(session)
    expect(decodeInvite(token.slice(0, -3)).ok).toBe(false)
    expect(decodeInvite(token.slice(0, -3)).errors[0]).toMatch(/truncated|edited/)
  })

  it('rejects an invite for a ritual this version does not have', () => {
    const result = decodeInvite(handBuilt({ t: 'ritual-from-the-future' }))
    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toMatch(/template/)
  })

  it('rejects an invite from a future wire version', () => {
    expect(decodeInvite(handBuilt({ v: 99 })).errors[0]).toMatch(/unsupported invite version/)
  })

  it('rejects a payload that is not an invite at all', () => {
    expect(decodeInvite('not-a-token').ok).toBe(false)
    expect(decodeInvite('').ok).toBe(false)
  })

  it('puts the token in the fragment so it never reaches a server log', () => {
    const url = inviteUrl('https://vibeclubs.ai/', session)
    expect(url.startsWith('https://vibeclubs.ai/s#')).toBe(true)
    expect(url).not.toContain('?')
    const token = tokenFromUrl(url)
    expect(token).not.toBeNull()
    expect(decodeInvite(token!).session).toEqual(session)
  })

  it('returns null when a pasted URL carries no invite', () => {
    expect(tokenFromUrl('https://vibeclubs.ai/s')).toBeNull()
  })
})
