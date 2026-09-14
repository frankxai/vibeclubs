import { describe, expect, it } from 'vitest'
import { SESSION_SCHEMA_VERSION, type Consent, type SessionSnapshot } from './schema'
import { buildProof, checkProof, renderProofCardSVG } from './proof'
import { exportRecap, recapToMarkdown } from './recap'

const START = 1_800_000_000_000
const NOW = START + 28 * 60_000

const consent = (ref: string, over: Partial<Consent> = {}): Consent => ({
  participantRef: ref,
  recapInclude: true,
  nameVisibility: 'named',
  recordedAtMs: START,
  sourceVersion: SESSION_SCHEMA_VERSION,
  ...over,
})

function snapshot(over: Partial<SessionSnapshot> = {}): SessionSnapshot {
  return {
    session: {
      schema: SESSION_SCHEMA_VERSION,
      id: 'sess1',
      formatId: 'vibeclub',
      templateId: '25_5',
      startEpochMs: START,
      soundtrackId: null,
      hostRef: 'host1',
    },
    format: { id: 'vibeclub', name: 'Vibeclub', intent: 'Ship something', crewMax: 8 },
    host: { ref: 'host1', displayName: 'Ada' },
    participants: [
      { ref: 'host1', displayName: 'Ada', joinedAtMs: START },
      { ref: 'p2', displayName: 'Grace', joinedAtMs: START },
      { ref: 'p3', displayName: 'Alan', joinedAtMs: START },
    ],
    commitments: [
      { id: 'c1', participantRef: 'host1', text: 'Land the parser', state: 'shipped', createdAtMs: START },
      { id: 'c2', participantRef: 'p2', text: 'Fix the drift bug', state: 'shipped', createdAtMs: START },
      { id: 'c3', participantRef: 'p3', text: 'Write the memo', state: 'open', createdAtMs: START },
    ],
    artifacts: [
      { id: 'a1', participantRef: 'host1', kind: 'note', value: 'Parser handles nested groups', createdAtMs: NOW },
      { id: 'a2', participantRef: 'p3', kind: 'link', value: 'https://example.com/alan-wip', createdAtMs: NOW },
    ],
    consents: [consent('host1'), consent('p2', { nameVisibility: 'anonymous' })],
    pauses: [],
    ...over,
  }
}

describe('exportRecap', () => {
  it('omits anyone who left no consent record', () => {
    const recap = exportRecap(snapshot(), NOW)
    expect(recap.entries.map((e) => e.label)).toEqual(['Ada', 'Crew member'])
    expect(recap.omittedCount).toBe(1)
    expect(JSON.stringify(recap)).not.toContain('Alan')
  })

  it('never quotes the text of an anonymous participant', () => {
    const recap = exportRecap(snapshot(), NOW)
    const anonymous = recap.entries.find((e) => !e.named)
    expect(anonymous?.shipped).toEqual([])
    expect(JSON.stringify(recap.entries)).not.toContain('Fix the drift bug')
  })

  it('treats a withdrawn consent as no consent', () => {
    const recap = exportRecap(
      snapshot({ consents: [consent('host1', { recapInclude: false }), consent('p2')] }),
      NOW,
    )
    expect(recap.entries.map((e) => e.label)).toEqual(['Grace'])
    expect(recap.omittedCount).toBe(2)
  })

  it('produces markdown that says how many people opted out', () => {
    const md = recapToMarkdown(exportRecap(snapshot(), NOW), 'Lofi coders')
    expect(md).toContain('# Lofi coders')
    expect(md).toContain('Land the parser')
    expect(md).toContain('1 person chose not to appear')
    expect(md).not.toContain('Alan')
  })

  it('says so plainly when nobody opted in', () => {
    const md = recapToMarkdown(exportRecap(snapshot({ consents: [] }), NOW), 'Lofi coders')
    expect(md).toContain('No one opted into this recap')
  })
})

describe('buildProof', () => {
  it('counts every artifact but names only consented ones', () => {
    const proof = buildProof(snapshot(), NOW)
    expect(proof.artifactCount).toBe(2)
    expect(proof.shareableTitles).toEqual(['Parser handles nested groups'])
    expect(proof.withheldCount).toBe(1)
    expect(proof.focusMinutes).toBe(25)
    expect(proof.commitmentsShipped).toBe(2)
  })

  it('refuses to call an empty session proven', () => {
    const check = checkProof(buildProof(snapshot({ artifacts: [] }), NOW))
    expect(check.ok).toBe(false)
    expect(check.reason).toMatch(/nothing shipped/)
  })

  it('renders a card that shows only shareable titles', () => {
    const svg = renderProofCardSVG(buildProof(snapshot(), NOW), {
      clubName: 'Lofi coders',
      handle: 'the crew',
      platform: 'meet',
    })
    expect(svg).toContain('Parser handles nested groups')
    expect(svg).not.toContain('alan-wip')
    expect(svg).toContain('shipped')
  })
})
