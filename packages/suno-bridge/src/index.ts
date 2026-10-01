/**
 * Per-listener music handoff. No guessed Suno endpoint or implicit paid request.
 * A host-supplied adapter owns authenticated budget/job/archive/rights handling.
 * Legacy key/base/fetch fields are accepted for compatibility but never invoked.
 */

export interface SunoGenerateOptions {
  prompt: string
  durationSeconds?: number
  instrumental?: boolean
  apiKey?: string
  apiBase?: string
  fallbackUrl?: string
  fetchImpl?: typeof fetch
  authorizedJobRef?: string
  generationAdapter?: (request: MusicJobRequest) => Promise<SunoTrack>
}

export interface SunoTrack {
  url: string
  source: 'suno' | 'provider' | 'fallback'
  evidence_kind?: 'adapter_reported_asset' | 'caller_supplied_asset'
  title?: string
  duration_seconds?: number
}

export interface MusicJobRequest {
  prompt: string
  durationSeconds: number
  instrumental: boolean
  authorizedJobRef: string
}

export async function generateMusic(opts: SunoGenerateOptions): Promise<SunoTrack> {
  if (!opts.generationAdapter) return fallback(opts.fallbackUrl)
  const duration = opts.durationSeconds ?? 180
  if (!opts.authorizedJobRef?.trim()) {
    throw new Error('A host-authorized job reference is required before generation')
  }
  if (
    !opts.prompt.trim() ||
    opts.prompt.length > 2000 ||
    !Number.isInteger(duration) ||
    duration < 3 ||
    duration > 600
  ) {
    throw new Error('Invalid music job request')
  }
  // An adapter failure may follow a charged submission. Surface it for host
  // reconciliation; never hide it behind fallback or repeat the paid operation.
  const track = await opts.generationAdapter({
    prompt: opts.prompt,
    durationSeconds: duration,
    instrumental: opts.instrumental ?? true,
    authorizedJobRef: opts.authorizedJobRef,
  })
  if (!track.url || new URL(track.url).protocol !== 'https:') {
    throw new Error('Adapter must report an HTTPS audio asset')
  }
  return { ...track, evidence_kind: 'adapter_reported_asset' }
}

function fallback(overrideUrl?: string): SunoTrack {
  if (overrideUrl) {
    if (new URL(overrideUrl).protocol !== 'https:')
      throw new Error('Fallback must be an HTTPS asset')
    return { url: overrideUrl, source: 'fallback', evidence_kind: 'caller_supplied_asset' }
  }
  throw new Error('Music generation is unavailable and no fallbackUrl was provided')
}

/** Heuristic: build a Suno prompt from a club's genre + time of day. */
export function promptFromClub(opts: {
  genre?: string
  clubType: string
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
}): string {
  const mood = moodFor(opts.timeOfDay ?? 'afternoon')
  const genre = opts.genre ?? defaultGenre(opts.clubType)
  return `${mood} ${genre}, instrumental, background focus music, no vocals, smooth and non-distracting`
}

function moodFor(t: 'morning' | 'afternoon' | 'evening' | 'night'): string {
  const map = {
    morning: 'bright uplifting',
    afternoon: 'steady focused',
    evening: 'warm mellow',
    night: 'quiet introspective',
  }
  return map[t]
}

function defaultGenre(clubType: string): string {
  const map: Record<string, string> = {
    coding: 'lofi hip hop',
    music: 'ambient electronic',
    design: 'downtempo',
    study: 'neoclassical piano',
    writing: 'acoustic ambient',
    fitness: 'uplifting house',
  }
  return map[clubType] ?? 'lofi hip hop'
}
