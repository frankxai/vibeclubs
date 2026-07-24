/**
 * @vibeclubs/suno-bridge
 *
 * Thin Suno API wrapper with an explicit caller-supplied fallback.
 *
 * This package is deliberately minimal: it exposes a single `generateMusic`
 * function that takes a prompt and returns a playable URL. If the Suno API is
 * unavailable (no key, rate limit, 5xx), it uses `fallbackUrl` when the caller
 * supplies one. It never returns an unverified asset URL.
 *
 * NOTE: Suno's public API is still evolving. Exact endpoint + auth shape may
 * need adjustment when Frank secures API access — see ENVIRONMENT.md §3.
 * The interface below is stable; implementation details (endpoints) are not.
 */

export interface SunoGenerateOptions {
  prompt: string
  durationSeconds?: number
  instrumental?: boolean
  apiKey?: string
  apiBase?: string
  fallbackUrl?: string
  fetchImpl?: typeof fetch
}

export interface SunoTrack {
  url: string
  source: 'suno' | 'fallback'
  title?: string
  duration_seconds?: number
}

export async function generateMusic(opts: SunoGenerateOptions): Promise<SunoTrack> {
  const apiKey =
    opts.apiKey ?? (typeof process !== 'undefined' ? process.env.SUNO_API_KEY : undefined)
  const apiBase = opts.apiBase ?? 'https://api.suno.com/v1'
  const fetchImpl = opts.fetchImpl ?? fetch

  if (!apiKey) return fallback(opts.fallbackUrl)

  try {
    const res = await fetchImpl(`${apiBase}/generate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: opts.prompt,
        duration_seconds: opts.durationSeconds ?? 180,
        instrumental: opts.instrumental ?? true,
        model: 'chirp-v4',
      }),
    })
    if (!res.ok) throw new Error(`Suno ${res.status}`)
    const body = (await res.json()) as {
      audio_url: string
      title?: string
      duration_seconds?: number
    }
    return {
      url: body.audio_url,
      source: 'suno',
      title: body.title,
      duration_seconds: body.duration_seconds,
    }
  } catch {
    return fallback(opts.fallbackUrl)
  }
}

function fallback(overrideUrl?: string): SunoTrack {
  if (overrideUrl) return { url: overrideUrl, source: 'fallback' }
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
