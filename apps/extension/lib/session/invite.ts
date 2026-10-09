/**
 * Invite links.
 *
 * The invite is the whole coordination layer. It carries the session id, the
 * template, the shared start epoch and the soundtrack — everything a browser
 * needs to compute the same timer as everyone else — and nothing about a
 * person. It is encoded into the URL *fragment*, which is never sent to a
 * server and never lands in an access log.
 *
 * Anything that looks like an email address, a phone number or an @handle is
 * refused at encode time. A field the schema does not know about is dropped.
 */

import { SESSION_SCHEMA_VERSION, templateById, validateSession, type Session } from './schema'

const INVITE_VERSION = 1

/** Compact wire form. Short keys because this rides in a URL. */
interface InviteWire {
  v: number
  i: string
  f: string
  t: string
  e: number
  k: string | null
  h: string
}

export interface DecodeResult {
  ok: boolean
  session: Session | null
  errors: string[]
}

const PII_PATTERNS: ReadonlyArray<{ label: string; re: RegExp }> = [
  { label: 'email address', re: /[\w.+-]+@[\w-]+\.[\w.-]+/ },
  { label: 'handle', re: /(^|\s)@[A-Za-z0-9_]{2,}/ },
  { label: 'phone number', re: /(^|\D)(\+?\d[\d\s().-]{7,}\d)(\D|$)/ },
]

/** Returns the label of the first PII shape found, or null. */
export function detectPii(value: string): string | null {
  for (const { label, re } of PII_PATTERNS) {
    if (re.test(value)) return label
  }
  return null
}

function toWire(session: Session): InviteWire {
  return {
    v: INVITE_VERSION,
    i: session.id,
    f: session.formatId,
    t: session.templateId,
    e: session.startEpochMs,
    k: session.soundtrackId,
    h: session.hostRef,
  }
}

function fromWire(wire: InviteWire): Session {
  return {
    schema: SESSION_SCHEMA_VERSION,
    id: wire.i,
    formatId: wire.f,
    templateId: wire.t,
    startEpochMs: wire.e,
    soundtrackId: wire.k ?? null,
    hostRef: wire.h,
  }
}

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** FNV-1a, 4 hex chars. Catches a truncated or mangled paste, not tampering. */
export function checksum(payload: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return (hash & 0xffff).toString(16).padStart(4, '0')
}

export class InviteError extends Error {}

/**
 * Encodes a session into an opaque, URL-safe token. Throws rather than emit a
 * link that carries personal data — a silent strip would hide the mistake from
 * the host who made it.
 */
export function encodeInvite(session: Session): string {
  const validation = validateSession(session)
  if (!validation.ok) throw new InviteError(`invalid session: ${validation.errors.join('; ')}`)

  const wire = toWire(session)
  for (const [key, value] of Object.entries(wire)) {
    if (typeof value !== 'string') continue
    const found = detectPii(value)
    if (found) throw new InviteError(`invite field "${key}" looks like a ${found}; invites carry no personal data`)
  }

  const payload = base64UrlEncode(JSON.stringify(wire))
  return `${payload}.${checksum(payload)}`
}

export function decodeInvite(token: string): DecodeResult {
  const fail = (...errors: string[]): DecodeResult => ({ ok: false, session: null, errors })
  const trimmed = token.trim().replace(/^#/, '')
  if (!trimmed) return fail('empty invite')

  const [payload, sum, ...rest] = trimmed.split('.')
  if (!payload || !sum || rest.length > 0) return fail('invite is not in the expected form')
  if (checksum(payload) !== sum) return fail('invite looks truncated or edited')

  let wire: InviteWire
  try {
    wire = JSON.parse(base64UrlDecode(payload)) as InviteWire
  } catch {
    return fail('invite could not be decoded')
  }

  if (wire?.v !== INVITE_VERSION) return fail(`unsupported invite version ${String(wire?.v)}`)

  const session = fromWire(wire)
  const validation = validateSession(session)
  if (!validation.ok) return fail(...validation.errors)
  if (!templateById(session.templateId)) return fail('this invite uses a ritual this version does not have')

  return { ok: true, session, errors: [] }
}

/** The fragment keeps the token off the wire; the path stays constant. */
export function inviteUrl(origin: string, session: Session): string {
  return `${origin.replace(/\/+$/, '')}/s#${encodeInvite(session)}`
}

export function tokenFromUrl(url: string): string | null {
  const hash = url.indexOf('#')
  if (hash === -1) return null
  const token = url.slice(hash + 1)
  return token || null
}

/** Opaque ids for invite-visible fields. Never derived from a name. */
export function opaqueRef(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  }
  return Math.random().toString(36).slice(2, 14)
}
