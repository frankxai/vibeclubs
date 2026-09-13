import { describe, expect, it } from 'vitest'
import { BuildDraftSchema, DEFAULT_DRAFT, TRACKS, buildPack } from './build-pack'

describe('host pack agenda', () => {
  it.each([60, 90, 120] as const)(
    'fits a %i-minute lock-in with no gaps or overlaps',
    (duration) => {
      const { agenda } = buildPack({ ...DEFAULT_DRAFT, duration })

      expect(agenda[0]?.start).toBe(0)
      expect(agenda.at(-1)?.end).toBe(duration)
      expect(agenda.reduce((minutes, phase) => minutes + phase.end - phase.start, 0)).toBe(duration)
      agenda.forEach((phase, index) => {
        expect(phase.end).toBeGreaterThan(phase.start)
        if (index > 0) expect(phase.start).toBe(agenda[index - 1]?.end)
      })
    },
  )
})

describe('host pack drafts', () => {
  it.each([
    null,
    {},
    { ...DEFAULT_DRAFT, version: 2 },
    { ...DEFAULT_DRAFT, track: 'unknown' },
    { ...DEFAULT_DRAFT, duration: 75 },
    { ...DEFAULT_DRAFT, crew: 1 },
    { ...DEFAULT_DRAFT, crew: 9 },
    { ...DEFAULT_DRAFT, crew: 2.5 },
    { ...DEFAULT_DRAFT, crew: '4' },
    { ...DEFAULT_DRAFT, name: '   ' },
    { ...DEFAULT_DRAFT, outcome: '' },
    { ...DEFAULT_DRAFT, outcome: 'x'.repeat(501) },
    { ...DEFAULT_DRAFT, place: 'Unknown call app' },
    { ...DEFAULT_DRAFT, soundtrack: 'Unknown sound' },
  ])('rejects an invalid stored draft: %j', (payload) => {
    expect(BuildDraftSchema.safeParse(payload).success).toBe(false)
  })

  it('restores valid drafts while preserving the host’s custom finish and timing', () => {
    const draft = {
      ...DEFAULT_DRAFT,
      name: '  Thursday crew  ',
      outcome: 'Export a rough mix for a private listen',
      when: 'Thursday 19:00 Europe/Amsterdam',
    }
    const restored = BuildDraftSchema.parse(JSON.parse(JSON.stringify(draft)))
    expect(restored.name).toBe('Thursday crew')
    expect(restored.outcome).toBe(draft.outcome)
    expect(buildPack(restored).invite).toContain(draft.when)
  })
})

describe('host pack handoffs', () => {
  it('gives agent work bounded tool access and failure checks', () => {
    const { brief } = buildPack({ ...DEFAULT_DRAFT, track: 'agents' })
    expect(brief).toContain('Vercel AI SDK')
    expect(brief).toContain('timeouts and bounded steps')
    expect(brief).toContain('invalid input, a tool failure, cancellation and exhausted budget')
    expect(brief).toContain('human confirmation for writes or external actions')
    expect(brief).toContain('Never claim an action succeeded without tool evidence')
  })

  it.each(['coding', 'design'] as const)('includes a usable web handoff for %s', (track) => {
    const { brief, v0, markdown } = buildPack({ ...DEFAULT_DRAFT, track })
    expect(brief).toContain('one end-to-end interaction')
    expect(brief).toContain('keyboard navigation')
    expect(v0).toContain(DEFAULT_DRAFT.outcome)
    expect(v0).toContain('identify anything still mocked')
    expect(v0).toContain('do not claim a production deployment')
    expect(markdown).toContain('## v0 prompt')
  })

  it.each(['music', 'writing', 'mixed'] as const)(
    'keeps %s work independent of web tooling',
    (track) => {
      const pack = buildPack({ ...DEFAULT_DRAFT, track })
      expect(pack.brief).toContain('Use the tools you already know')
      expect(pack.brief).toContain(TRACKS.find((item) => item.id === track)?.proof)
      expect(pack.markdown).not.toContain('## v0 prompt')
      expect(pack.brief).not.toContain('Next.js')
    },
  )

  it('keeps an in-person invitation private and attendance prospective', () => {
    const { invite } = buildPack({ ...DEFAULT_DRAFT, place: 'In person', crew: 6 })
    expect(invite).toContain('up to 6 people')
    expect(invite).toContain('Share the location privately.')
    expect(invite).not.toContain('call link')
    expect(invite).toContain('Passing or sharing privately is welcome.')
  })

  it('leaves actual outcomes for the host and does not turn a draft into completion evidence', () => {
    const { recap, markdown } = buildPack(DEFAULT_DRAFT)
    expect(recap).toContain('Never invent attendance, progress, quotes or completion')
    expect(recap).toContain('Actual result:\nProof and sharing permission:\nWhat remains:')
    expect(recap).toContain('An unfinished result is valid')
    expect(markdown).toContain('Nobody arrives: complete a solo block; do not invent attendance')
    expect(markdown).toContain('Do not message the crew or publish automatically')
    expect(markdown).not.toMatch(
      /\b(?:4 people attended|successfully deployed|published to the directory)\b/i,
    )
  })
})
