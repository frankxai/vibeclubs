/**
 * Rights-safe soundtrack registry.
 *
 * A track may only appear here with a named licence, a link to that licence,
 * and an explicit statement about commercial use. There is no "unknown"
 * option: a track whose rights nobody checked is a track we cannot ship, so
 * an empty registry is the correct state until one clears review.
 *
 * `@vibeclubs/vibe-mix` ships preset ids with empty URLs for exactly this
 * reason. This registry is what fills them, one cleared track at a time.
 */

export interface TrackLicense {
  /** SPDX id where one exists, e.g. CC-BY-4.0. */
  spdx: string | null
  name: string
  url: string
  commercialUse: boolean
  attributionRequired: boolean
}

export interface Soundtrack {
  id: string
  title: string
  artist: string
  /** Where the file is served from. Must be CORS-enabled for the mixer. */
  url: string
  /** Which vibe-mix ambient preset this satisfies. */
  presetId: string
  license: TrackLicense
  /** Who checked the rights, and when. */
  clearedBy: string
  clearedAt: string
  attribution: string
}

/**
 * Empty by design. Nothing has passed rights review yet, and an ambient layer
 * that plays nothing is honest where one that plays an unlicensed loop is not.
 */
export const SOUNDTRACK_REGISTRY: readonly Soundtrack[] = []

export function soundtrackById(id: string | null): Soundtrack | null {
  if (!id) return null
  return SOUNDTRACK_REGISTRY.find((t) => t.id === id) ?? null
}

export function soundtracksForPreset(presetId: string): Soundtrack[] {
  return SOUNDTRACK_REGISTRY.filter((t) => t.presetId === presetId)
}

export interface RightsCheck {
  ok: boolean
  reasons: string[]
}

/** The gate a track must pass before it can be added to the registry. */
export function checkRights(track: Soundtrack): RightsCheck {
  const reasons: string[] = []
  if (!track.url.startsWith('https://')) reasons.push('url must be https')
  if (!track.license.name.trim()) reasons.push('license.name is required')
  if (!/^https:\/\//.test(track.license.url)) reasons.push('license.url must link to the licence text')
  if (!track.clearedBy.trim()) reasons.push('clearedBy is required — a person owns this decision')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(track.clearedAt)) reasons.push('clearedAt must be an ISO date')
  if (track.license.attributionRequired && !track.attribution.trim()) {
    reasons.push('licence requires attribution but none is provided')
  }
  return { ok: reasons.length === 0, reasons }
}

export type ProbeResult = 'ok' | 'timeout' | 'error' | 'unsupported'

/**
 * Probes whether a track can actually load in *this* browser.
 *
 * Some Chrome configurations block media-element requests without ever firing
 * an `error` event, so an audio element can hang forever with no signal. A
 * timeout is the only reliable failure detector; treat `timeout` as "the vibe
 * layer is unavailable here" and keep the session running silently.
 */
export function probeSoundtrack(url: string, timeoutMs = 4000): Promise<ProbeResult> {
  if (typeof Audio === 'undefined') return Promise.resolve('unsupported')

  return new Promise<ProbeResult>((resolve) => {
    const el = new Audio()
    let settled = false

    const done = (result: ProbeResult) => {
      if (settled) return
      settled = true
      clearTimeout(watchdog)
      el.removeEventListener('canplaythrough', onReady)
      el.removeEventListener('error', onError)
      el.src = ''
      resolve(result)
    }

    const onReady = () => done('ok')
    const onError = () => done('error')
    const watchdog = setTimeout(() => done('timeout'), timeoutMs)

    el.addEventListener('canplaythrough', onReady, { once: true })
    el.addEventListener('error', onError, { once: true })
    el.crossOrigin = 'anonymous'
    el.preload = 'auto'
    el.src = url
    el.load()
  })
}
