/**
 * The storage boundary. There is no server in this path: a session lives in
 * `chrome.storage.local` and is shared only as an invite token, so the whole
 * product works with the network down and leaves nothing behind on a host.
 */

import { opaqueRef } from './invite'
import {
  SESSION_SCHEMA_VERSION,
  templateById,
  type ClubFormat,
  type Session,
  type SessionSnapshot,
} from './schema'

const STORAGE_KEY = 'session.v1'

export const DEFAULT_FORMAT: ClubFormat = {
  id: 'vibeclub',
  name: 'Vibeclub',
  intent: 'Show up, run the timer together, leave with something shipped.',
  crewMax: 8,
}

export interface CreateSessionInput {
  templateId: string
  startEpochMs: number
  hostDisplayName: string
  soundtrackId?: string | null
  format?: ClubFormat
}

export function createSession(input: CreateSessionInput): SessionSnapshot {
  if (!templateById(input.templateId)) throw new Error(`unknown template ${input.templateId}`)
  const hostRef = opaqueRef()
  const session: Session = {
    schema: SESSION_SCHEMA_VERSION,
    id: opaqueRef(),
    formatId: (input.format ?? DEFAULT_FORMAT).id,
    templateId: input.templateId,
    startEpochMs: input.startEpochMs,
    soundtrackId: input.soundtrackId ?? null,
    hostRef,
  }
  return {
    session,
    format: input.format ?? DEFAULT_FORMAT,
    host: { ref: hostRef, displayName: input.hostDisplayName },
    participants: [{ ref: hostRef, displayName: input.hostDisplayName, joinedAtMs: Date.now() }],
    commitments: [],
    artifacts: [],
    consents: [],
    pauses: [],
  }
}

/** Joining an invite makes you a participant of someone else's session. */
export function joinSession(session: Session, displayName: string): SessionSnapshot {
  const ref = opaqueRef()
  return {
    session,
    format: DEFAULT_FORMAT,
    host: { ref: session.hostRef, displayName: 'Host' },
    participants: [{ ref, displayName, joinedAtMs: Date.now() }],
    commitments: [],
    artifacts: [],
    consents: [],
    pauses: [],
  }
}

export function loadSnapshot(): Promise<SessionSnapshot | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
      const stored = data[STORAGE_KEY] as SessionSnapshot | undefined
      resolve(stored?.session?.schema === SESSION_SCHEMA_VERSION ? stored : null)
    })
  })
}

export function saveSnapshot(snapshot: SessionSnapshot): Promise<void> {
  return chrome.storage.local.set({ [STORAGE_KEY]: snapshot })
}

export function clearSnapshot(): Promise<void> {
  return chrome.storage.local.remove(STORAGE_KEY)
}
