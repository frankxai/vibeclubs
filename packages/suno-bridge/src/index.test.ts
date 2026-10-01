import { describe, expect, it, vi } from 'vitest'
import { generateMusic, promptFromClub } from './index'

describe('promptFromClub', () => {
  it('defaults genre based on club type', () => {
    expect(promptFromClub({ clubType: 'coding' })).toContain('lofi hip hop')
    expect(promptFromClub({ clubType: 'music' })).toContain('ambient electronic')
  })

  it('shifts mood by time of day', () => {
    expect(promptFromClub({ clubType: 'coding', timeOfDay: 'night' })).toContain(
      'quiet introspective',
    )
    expect(promptFromClub({ clubType: 'coding', timeOfDay: 'morning' })).toContain(
      'bright uplifting',
    )
  })

  it('accepts explicit genre override', () => {
    const out = promptFromClub({ clubType: 'coding', genre: 'drum and bass' })
    expect(out).toContain('drum and bass')
  })
})

describe('generateMusic', () => {
  it('uses the caller fallback when no API key is provided', async () => {
    const result = await generateMusic({
      prompt: 'lofi',
      apiKey: '',
      fallbackUrl: 'https://audio.example/fallback.mp3',
    })
    expect(result.source).toBe('fallback')
    expect(result.url).toBe('https://audio.example/fallback.mp3')
  })

  it('fails closed when no API key or verified fallback is available', async () => {
    await expect(generateMusic({ prompt: 'lofi', apiKey: '' })).rejects.toThrow(
      'no fallbackUrl was provided',
    )
  })

  it('never calls a guessed API even when legacy key/base are supplied', async () => {
    const network = vi.fn() as unknown as typeof fetch
    const result = await generateMusic({ prompt: 'lofi', apiKey: 'fixture', apiBase: 'https://untrusted.invalid', fetchImpl: network, fallbackUrl: 'https://audio.example/fallback.mp3' })
    expect(result.source).toBe('fallback')
    expect(network).not.toHaveBeenCalled()
  })

  it('requires a host job before calling the adapter', async () => {
    const adapter = vi.fn()
    await expect(generateMusic({ prompt: 'lofi', generationAdapter: adapter })).rejects.toThrow('host-authorized')
    expect(adapter).not.toHaveBeenCalled()
  })

  it('returns a declared adapter asset without claiming independent verification', async () => {
    const adapter = vi.fn(async () => ({ url: 'https://audio.example/take.mp3', source: 'provider' as const }))
    const result = await generateMusic({ prompt: 'lofi', authorizedJobRef: 'owner/work/candidate/reservation', generationAdapter: adapter })
    expect(result.evidence_kind).toBe('adapter_reported_asset')
    expect(adapter).toHaveBeenCalledOnce()
  })

  it('propagates uncertain paid submission rather than silently falling back', async () => {
    const adapter = vi.fn(async () => { throw new Error('submission_unknown') })
    await expect(generateMusic({ prompt: 'lofi', authorizedJobRef: 'job', generationAdapter: adapter, fallbackUrl: 'https://audio.example/fallback.mp3' })).rejects.toThrow('submission_unknown')
    expect(adapter).toHaveBeenCalledOnce()
  })

  it('rejects executable or insecure fallback URLs', async () => {
    await expect(generateMusic({ prompt: 'lofi', fallbackUrl: 'javascript:alert(1)' })).rejects.toThrow('HTTPS')
  })
})
