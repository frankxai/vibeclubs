import { describe, expect, it, vi } from 'vitest'
import { generateMusic, promptFromClub } from './index'

describe('promptFromClub', () => {
  it('defaults genre based on club type', () => {
    expect(promptFromClub({ clubType: 'coding' })).toContain('lofi hip hop')
    expect(promptFromClub({ clubType: 'music' })).toContain('ambient electronic')
  })

  it('shifts mood by time of day', () => {
    expect(promptFromClub({ clubType: 'coding', timeOfDay: 'night' })).toContain('quiet introspective')
    expect(promptFromClub({ clubType: 'coding', timeOfDay: 'morning' })).toContain('bright uplifting')
  })

  it('accepts explicit genre override', () => {
    const out = promptFromClub({ clubType: 'coding', genre: 'drum and bass' })
    expect(out).toContain('drum and bass')
  })
})

describe('generateMusic', () => {
  it('falls back to curated track when no API key provided', async () => {
    const result = await generateMusic({ prompt: 'lofi', apiKey: '' })
    expect(result.source).toBe('fallback')
    expect(result.url).toMatch(/\.mp3$/)
  })

  it('falls back when Suno API returns non-OK', async () => {
    const failingFetch = vi.fn(
      async () => new Response('nope', { status: 503 }),
    ) as unknown as typeof fetch
    const result = await generateMusic({ prompt: 'lofi', apiKey: 'fake', fetchImpl: failingFetch })
    expect(result.source).toBe('fallback')
    expect(failingFetch).toHaveBeenCalledOnce()
  })

  it('uses Suno response when successful', async () => {
    const ok = vi.fn(
      async () =>
        new Response(JSON.stringify({ audio_url: 'https://ex.com/track.mp3', title: 'Lofi One' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
    ) as unknown as typeof fetch
    const result = await generateMusic({ prompt: 'lofi', apiKey: 'fake', fetchImpl: ok })
    expect(result.source).toBe('suno')
    expect(result.url).toBe('https://ex.com/track.mp3')
    expect(result.title).toBe('Lofi One')
  })
})
