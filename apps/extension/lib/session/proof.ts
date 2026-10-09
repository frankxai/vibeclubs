/**
 * Proof — the end-of-session artifact.
 *
 * Activation for Vibeclubs is a completed session that produced at least one
 * thing. `buildProof` refuses to call a session proven when nothing shipped,
 * because a card celebrating an empty session is the exact dishonesty that
 * makes co-working products feel hollow.
 *
 * The shareable image is rendered by @vibeclubs/session-card so every card in
 * the format looks the same; this module decides what is true enough to put
 * on one.
 */

import { renderSessionCardSVG, type SessionCardData } from '@vibeclubs/session-card'
import { consentAllowsRecap, consentFor, templateById, type SessionSnapshot } from './schema'
import { focusMinutesAt, timelineFromTemplate, timerStateAt } from './timer'

export interface Proof {
  schema: 'session.v1'
  sessionId: string
  generatedAtMs: number
  focusMinutes: number
  cyclesCompleted: number
  crewSize: number
  artifactCount: number
  commitmentsShipped: number
  commitmentsOpen: number
  /** Only artifacts whose author consented to appear in an export. */
  shareableTitles: string[]
  /** Artifacts counted but not named, because their author did not consent. */
  withheldCount: number
}

export interface ProofCheck {
  ok: boolean
  reason: string | null
}

export function buildProof(snapshot: SessionSnapshot, nowMs: number): Proof {
  const template = templateById(snapshot.session.templateId)
  const timeline = template
    ? timelineFromTemplate(template, snapshot.session.startEpochMs, snapshot.pauses)
    : null

  const state = timeline ? timerStateAt(timeline, nowMs) : null
  const shareable: string[] = []
  let withheld = 0

  for (const artifact of snapshot.artifacts) {
    if (consentAllowsRecap(consentFor(snapshot, artifact.participantRef))) {
      shareable.push(artifact.value)
    } else {
      withheld += 1
    }
  }

  return {
    schema: 'session.v1',
    sessionId: snapshot.session.id,
    generatedAtMs: nowMs,
    focusMinutes: timeline ? focusMinutesAt(timeline, nowMs) : 0,
    cyclesCompleted: state?.focusCompleted ?? 0,
    crewSize: snapshot.participants.length,
    artifactCount: snapshot.artifacts.length,
    commitmentsShipped: snapshot.commitments.filter((c) => c.state === 'shipped').length,
    commitmentsOpen: snapshot.commitments.filter((c) => c.state === 'open').length,
    shareableTitles: shareable,
    withheldCount: withheld,
  }
}

/** The activation gate: a session is proven only if something came out of it. */
export function checkProof(proof: Proof): ProofCheck {
  if (proof.artifactCount < 1) {
    return { ok: false, reason: 'no artifact was added — the session ran, but nothing shipped' }
  }
  if (proof.focusMinutes < 1) {
    return { ok: false, reason: 'less than a minute of focus elapsed' }
  }
  return { ok: true, reason: null }
}

export interface ProofCardContext {
  clubName: string
  /** A label the host chooses. Defaults to the format, never to an account. */
  handle: string
  platform: string
}

export function proofToCardData(proof: Proof, context: ProofCardContext): SessionCardData {
  return {
    clubName: context.clubName,
    handle: context.handle,
    durationMinutes: proof.focusMinutes,
    pomodoroCycles: proof.cyclesCompleted,
    platform: context.platform,
    date: new Date(proof.generatedAtMs),
    shipped: proof.commitmentsShipped,
    artifacts: proof.shareableTitles,
  }
}

export function renderProofCardSVG(proof: Proof, context: ProofCardContext): string {
  return renderSessionCardSVG(proofToCardData(proof, context))
}
