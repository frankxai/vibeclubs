/**
 * Session.v1 — the typed contract for one Vibeclub session.
 *
 * A Vibeclub is a format, not a network. The format is: a crew, a timer, a
 * soundtrack, and shipped proof. Session.v1 is the smallest set of nodes that
 * can describe one run of that format without a server, without accounts, and
 * without a participant's name ever leaving the browser unless they said yes.
 *
 * Every node carries an owner, provenance, version, visibility and evaluation
 * rule in NODE_REGISTRY below. Nothing in this schema is a database row —
 * these are values encoded in an invite link or held in `chrome.storage.local`.
 */

import type { Phase as PomodoroPhase, Preset } from '@vibeclubs/pomodoro-sync'
import { bpmForPreset, sequenceForPreset } from '@vibeclubs/pomodoro-sync'

export const SESSION_SCHEMA_VERSION = 'session.v1' as const
export type SessionSchemaVersion = typeof SESSION_SCHEMA_VERSION

export type NodeType =
  | 'ClubFormat'
  | 'Session'
  | 'Host'
  | 'Participant'
  | 'Commitment'
  | 'TimerState'
  | 'Soundtrack'
  | 'Artifact'
  | 'Proof'
  | 'Recap'
  | 'Consent'
  | 'Template'

/**
 * Where a node is allowed to exist.
 *   local  — this browser only. Never encoded into a link, never transmitted.
 *   invite — travels inside the invite fragment, so it must contain no PII.
 *   shared — may be exported by the host once consent allows it.
 */
export type Visibility = 'local' | 'invite' | 'shared'

export type Provenance =
  | 'host-authored'
  | 'participant-authored'
  | 'invite-encoded'
  | 'derived'
  | 'registry'

export interface NodeContract {
  owner: 'host' | 'participant' | 'registry' | 'runtime'
  provenance: Provenance
  version: SessionSchemaVersion
  visibility: Visibility
  /** The single check that decides whether an instance of this node is valid. */
  evaluation: string
}

export const NODE_REGISTRY: Readonly<Record<NodeType, NodeContract>> = {
  ClubFormat: {
    owner: 'host',
    provenance: 'host-authored',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'invite',
    evaluation: 'id is a slug; name is non-empty; crewMax <= 12 (a crew, not an audience)',
  },
  Template: {
    owner: 'registry',
    provenance: 'registry',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'invite',
    evaluation: 'preset resolves in @vibeclubs/pomodoro-sync and yields >= 1 phase',
  },
  Session: {
    owner: 'host',
    provenance: 'invite-encoded',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'invite',
    evaluation: 'startEpochMs > 0 and every referenced id resolves; carries no free text about people',
  },
  Host: {
    owner: 'host',
    provenance: 'host-authored',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'local',
    evaluation: 'ref is opaque; displayName never leaves this browser',
  },
  Participant: {
    owner: 'participant',
    provenance: 'participant-authored',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'local',
    evaluation: 'ref is opaque and unique within the session',
  },
  Commitment: {
    owner: 'participant',
    provenance: 'participant-authored',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'local',
    evaluation: 'text is non-empty after trim and state is one of open/shipped/dropped',
  },
  TimerState: {
    owner: 'runtime',
    provenance: 'derived',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'local',
    evaluation: 'a pure function of (timeline, now) — two clients with the same inputs agree',
  },
  Soundtrack: {
    owner: 'registry',
    provenance: 'registry',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'invite',
    evaluation: 'license.name and license.url are present and commercialUse is stated',
  },
  Artifact: {
    owner: 'participant',
    provenance: 'participant-authored',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'local',
    evaluation: 'value is non-empty; kind link requires an http(s) URL',
  },
  Proof: {
    owner: 'host',
    provenance: 'derived',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'shared',
    evaluation: 'artifactCount >= 1 — a session with no artifact produced no proof',
  },
  Recap: {
    owner: 'host',
    provenance: 'derived',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'shared',
    evaluation: 'every named line traces to a Consent with recapInclude true',
  },
  Consent: {
    owner: 'participant',
    provenance: 'participant-authored',
    version: SESSION_SCHEMA_VERSION,
    visibility: 'local',
    evaluation: 'recordedAtMs is set and the participant acted — absence is never consent',
  },
}

// ---------------------------------------------------------------------------
// Format and template
// ---------------------------------------------------------------------------

export interface ClubFormat {
  id: string
  name: string
  /** One line a host can read aloud when the session opens. */
  intent: string
  crewMax: number
}

export type TimerPhaseKind = Exclude<PomodoroPhase, 'idle'>

export interface TemplatePhase {
  kind: TimerPhaseKind
  seconds: number
}

export interface Template {
  id: string
  label: string
  /** The ritual's shape is owned by @vibeclubs/pomodoro-sync, not duplicated here. */
  preset: Preset
  phases: readonly TemplatePhase[]
  bpm: number
  /** Whether the phase sequence repeats until the host ends the session. */
  loop: boolean
}

/**
 * Builds a Template from a pomodoro-sync preset. The sequence is read through
 * the package's public interface so a preset change lands here automatically
 * instead of drifting.
 */
export function templateFromPreset(preset: Preset, label: string, loop = true): Template {
  const phases = sequenceForPreset(preset).map<TemplatePhase>((p) => ({
    kind: p.phase === 'idle' ? 'focus' : p.phase,
    seconds: p.durationSec,
  }))
  return { id: preset, label, preset, phases, bpm: bpmForPreset(preset), loop }
}

export const TEMPLATES: readonly Template[] = [
  templateFromPreset('25_5', 'Classic — 25 on, 5 off'),
  templateFromPreset('50_10', 'Deep — 50 on, 10 off'),
  templateFromPreset('vibe_coding_sprint', 'Sprint — three blocks, ship after each', false),
  templateFromPreset('lightning', 'Lightning — 10 on, 2 to show'),
  templateFromPreset('music_jam', 'Jam — 45, dance, 40, ship', false),
]

export function templateById(id: string): Template | null {
  return TEMPLATES.find((t) => t.id === id) ?? null
}

// ---------------------------------------------------------------------------
// Session and people
// ---------------------------------------------------------------------------

export interface Session {
  schema: SessionSchemaVersion
  /** Opaque id. Not derived from any name, handle or email. */
  id: string
  formatId: string
  templateId: string
  /** The shared clock origin. Every participant computes phase from this. */
  startEpochMs: number
  soundtrackId: string | null
  /** Opaque host reference; the host's display name stays in their browser. */
  hostRef: string
}

export interface Host {
  ref: string
  displayName: string
}

export interface Participant {
  ref: string
  displayName: string
  joinedAtMs: number
}

export type CommitmentState = 'open' | 'shipped' | 'dropped'

export interface Commitment {
  id: string
  participantRef: string
  text: string
  state: CommitmentState
  createdAtMs: number
  shippedAtMs?: number
}

export type ArtifactKind = 'link' | 'note'

export interface Artifact {
  id: string
  participantRef: string
  kind: ArtifactKind
  value: string
  createdAtMs: number
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export type NameVisibility = 'named' | 'anonymous' | 'excluded'

export interface Consent {
  participantRef: string
  /** False or missing means the participant does not appear in an export. */
  recapInclude: boolean
  nameVisibility: NameVisibility
  /** Recording is opt-in and off; this schema has no field that turns it on. */
  recordedAtMs: number
  sourceVersion: SessionSchemaVersion
}

export function consentAllowsRecap(consent: Consent | undefined): boolean {
  if (!consent) return false
  if (!consent.recapInclude) return false
  return consent.nameVisibility !== 'excluded'
}

export function consentAllowsName(consent: Consent | undefined): boolean {
  return consentAllowsRecap(consent) && consent?.nameVisibility === 'named'
}

// ---------------------------------------------------------------------------
// Snapshot — everything one browser knows about a session
// ---------------------------------------------------------------------------

/**
 * The local record of a session. Only `session` is shared (via the invite);
 * everything else lives in this browser until the host exports a recap and the
 * consent rules decide what may leave.
 */
export interface SessionSnapshot {
  session: Session
  format: ClubFormat
  host: Host
  participants: readonly Participant[]
  commitments: readonly Commitment[]
  artifacts: readonly Artifact[]
  consents: readonly Consent[]
  pauses: readonly { pausedAtMs: number; resumedAtMs: number | null }[]
}

export function consentFor(
  snapshot: Pick<SessionSnapshot, 'consents'>,
  participantRef: string,
): Consent | undefined {
  return snapshot.consents.find((c) => c.participantRef === participantRef)
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  ok: boolean
  errors: string[]
}

export function validateSession(input: unknown): ValidationResult {
  const errors: string[] = []
  const s = input as Partial<Session> | null
  if (!s || typeof s !== 'object') return { ok: false, errors: ['session is not an object'] }
  if (s.schema !== SESSION_SCHEMA_VERSION) errors.push(`schema must be ${SESSION_SCHEMA_VERSION}`)
  if (typeof s.id !== 'string' || !s.id) errors.push('id is required')
  if (typeof s.formatId !== 'string' || !s.formatId) errors.push('formatId is required')
  if (typeof s.templateId !== 'string' || !templateById(s.templateId)) {
    errors.push('templateId does not resolve to a known template')
  }
  if (typeof s.startEpochMs !== 'number' || !Number.isFinite(s.startEpochMs) || s.startEpochMs <= 0) {
    errors.push('startEpochMs must be a positive epoch in milliseconds')
  }
  if (typeof s.hostRef !== 'string' || !s.hostRef) errors.push('hostRef is required')
  if (s.soundtrackId !== null && typeof s.soundtrackId !== 'string') {
    errors.push('soundtrackId must be a string or null')
  }
  return { ok: errors.length === 0, errors }
}
