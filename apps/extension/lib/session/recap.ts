/**
 * Recap export.
 *
 * A recap leaves the browser. That makes consent the only interesting logic in
 * this file: absence of a Consent record means "no", not "not yet asked". A
 * participant who consented anonymously appears as a crew member with no name
 * and no quoted text; a participant who did not consent appears nowhere at all,
 * not even as an initial, and their commitments are counted but never quoted.
 */

import {
  consentAllowsName,
  consentAllowsRecap,
  consentFor,
  templateById,
  type SessionSnapshot,
} from './schema'
import { buildProof, type Proof } from './proof'

export interface RecapEntry {
  /** A display name, or 'Crew member' when consent was anonymous. */
  label: string
  named: boolean
  shipped: string[]
  artifacts: string[]
}

export interface Recap {
  schema: 'session.v1'
  sessionId: string
  generatedAtMs: number
  ritual: string
  focusMinutes: number
  cyclesCompleted: number
  crewSize: number
  entries: RecapEntry[]
  /** How many people are absent from `entries` because consent was missing. */
  omittedCount: number
  proof: Proof
}

export function exportRecap(snapshot: SessionSnapshot, nowMs: number): Recap {
  const proof = buildProof(snapshot, nowMs)
  const template = templateById(snapshot.session.templateId)
  const entries: RecapEntry[] = []
  let omitted = 0

  for (const participant of snapshot.participants) {
    const consent = consentFor(snapshot, participant.ref)
    if (!consentAllowsRecap(consent)) {
      omitted += 1
      continue
    }
    const named = consentAllowsName(consent)
    entries.push({
      label: named ? participant.displayName : 'Crew member',
      named,
      shipped: named
        ? snapshot.commitments
            .filter((c) => c.participantRef === participant.ref && c.state === 'shipped')
            .map((c) => c.text)
        : [],
      artifacts: named
        ? snapshot.artifacts.filter((a) => a.participantRef === participant.ref).map((a) => a.value)
        : [],
    })
  }

  return {
    schema: 'session.v1',
    sessionId: snapshot.session.id,
    generatedAtMs: nowMs,
    ritual: template?.label ?? snapshot.session.templateId,
    focusMinutes: proof.focusMinutes,
    cyclesCompleted: proof.cyclesCompleted,
    crewSize: snapshot.participants.length,
    entries,
    omittedCount: omitted,
    proof,
  }
}

/** Plain markdown a host can paste anywhere. No tracking, no links home. */
export function recapToMarkdown(recap: Recap, clubName: string): string {
  const date = new Date(recap.generatedAtMs).toISOString().slice(0, 10)
  const lines: string[] = [
    `# ${clubName} — ${date}`,
    '',
    `${recap.ritual} · ${recap.focusMinutes} focus minutes · ${recap.cyclesCompleted} cycles · ${recap.crewSize} in the crew`,
    '',
  ]

  if (recap.entries.length === 0) {
    lines.push('No one opted into this recap, so it records the session and nothing about the people in it.')
  } else {
    lines.push('## Shipped')
    lines.push('')
    for (const entry of recap.entries) {
      const items = [...entry.shipped, ...entry.artifacts]
      if (items.length === 0) {
        lines.push(`- ${entry.label} — showed up`)
        continue
      }
      lines.push(`- ${entry.label}`)
      for (const item of items) lines.push(`  - ${item}`)
    }
  }

  if (recap.omittedCount > 0) {
    lines.push('')
    lines.push(
      `_${recap.omittedCount} ${recap.omittedCount === 1 ? 'person' : 'people'} chose not to appear in this recap._`,
    )
  }

  lines.push('')
  return lines.join('\n')
}
