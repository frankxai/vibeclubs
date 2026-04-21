/**
 * @vibeclubs/vibe-mix
 *
 * Three-layer Web Audio mixer. Pure TypeScript, no framework deps.
 *
 *   Ambient   — shared royalty-free loops, streamed from URL, seamless looping
 *   Music     — per-listener track (Suno / BYO), one at a time, crossfade on swap
 *   Page      — tab audio / voice, exposed as a GainNode for host code to wire
 *
 * The mixer owns an AudioContext, one MediaElementAudioSourceNode per layer,
 * and a master GainNode routed to destination. Consumers adjust layer levels
 * independently. All three faders are equal-power curves (gain squared) to
 * feel natural when mixing.
 */

export type Layer = 'ambient' | 'music' | 'page'

export interface MixerPreset {
  id: string
  label: string
  url: string // audio file (mp3/ogg/wav), must be CORS-enabled
}

export const AMBIENT_PRESETS: MixerPreset[] = [
  { id: 'lofi', label: 'Lo-fi', url: '' },
  { id: 'rain', label: 'Rain', url: '' },
  { id: 'cafe', label: 'Café', url: '' },
  { id: 'nature', label: 'Nature', url: '' },
  { id: 'space', label: 'Space', url: '' },
]

export interface MixerOptions {
  ambientBaseUrl?: string
  onLevelChange?: (layer: Layer, level: number) => void
  duckOnVoice?: boolean
}

export interface Mixer {
  readonly context: AudioContext
  readonly pageGain: GainNode
  setLevel(layer: Layer, level: number): void
  getLevel(layer: Layer): number
  loadAmbient(presetId: string): Promise<void>
  playMusic(url: string): Promise<void>
  stop(layer: Layer): void
  stopAll(): void
  duckAmbient(amountDb: number, durationMs?: number): void
  dispose(): void
}

export function createMixer(options: MixerOptions = {}): Mixer {
  const context = new AudioContext()
  const levels: Record<Layer, number> = { ambient: 0.3, music: 0.25, page: 0.85 }

  const gains: Record<Layer, GainNode> = {
    ambient: context.createGain(),
    music: context.createGain(),
    page: context.createGain(),
  }

  for (const layer of Object.keys(gains) as Layer[]) {
    gains[layer].gain.value = equalPower(levels[layer])
    gains[layer].connect(context.destination)
  }

  let ambientEl: HTMLAudioElement | null = null
  let ambientNode: MediaElementAudioSourceNode | null = null
  let musicEl: HTMLAudioElement | null = null
  let musicNode: MediaElementAudioSourceNode | null = null

  function ensureAmbientEl() {
    if (ambientEl) return ambientEl
    ambientEl = new Audio()
    ambientEl.loop = true
    ambientEl.crossOrigin = 'anonymous'
    ambientNode = context.createMediaElementSource(ambientEl)
    ambientNode.connect(gains.ambient)
    return ambientEl
  }

  function ensureMusicEl() {
    if (musicEl) return musicEl
    musicEl = new Audio()
    musicEl.crossOrigin = 'anonymous'
    musicNode = context.createMediaElementSource(musicEl)
    musicNode.connect(gains.music)
    return musicEl
  }

  return {
    context,
    pageGain: gains.page,

    setLevel(layer, level) {
      const clamped = Math.max(0, Math.min(1, level))
      levels[layer] = clamped
      gains[layer].gain.linearRampToValueAtTime(equalPower(clamped), context.currentTime + 0.08)
      options.onLevelChange?.(layer, clamped)
    },

    getLevel(layer) {
      return levels[layer]
    },

    async loadAmbient(presetId: string) {
      const preset = AMBIENT_PRESETS.find((p) => p.id === presetId)
      if (!preset) throw new Error(`Unknown ambient preset: ${presetId}`)
      const url = preset.url || `${options.ambientBaseUrl ?? '/ambient'}/${presetId}.mp3`
      const el = ensureAmbientEl()
      el.src = url
      await el.play()
    },

    async playMusic(url: string) {
      const el = ensureMusicEl()
      // Crossfade: duck current music to 0, swap src, ramp back up.
      const start = context.currentTime
      gains.music.gain.linearRampToValueAtTime(0, start + 0.4)
      await new Promise((r) => setTimeout(r, 420))
      el.src = url
      await el.play()
      gains.music.gain.linearRampToValueAtTime(equalPower(levels.music), context.currentTime + 0.4)
    },

    stop(layer) {
      if (layer === 'ambient' && ambientEl) ambientEl.pause()
      if (layer === 'music' && musicEl) musicEl.pause()
      // 'page' is host-managed; consumers pause their own tab
    },

    stopAll() {
      ambientEl?.pause()
      musicEl?.pause()
    },

    duckAmbient(amountDb: number, durationMs = 300) {
      const factor = Math.pow(10, amountDb / 20)
      const base = equalPower(levels.ambient)
      const now = context.currentTime
      gains.ambient.gain.cancelScheduledValues(now)
      gains.ambient.gain.setValueAtTime(gains.ambient.gain.value, now)
      gains.ambient.gain.linearRampToValueAtTime(base * factor, now + durationMs / 1000)
      gains.ambient.gain.linearRampToValueAtTime(base, now + (durationMs / 1000) + 0.8)
    },

    dispose() {
      ambientEl?.pause()
      musicEl?.pause()
      ambientNode?.disconnect()
      musicNode?.disconnect()
      for (const g of Object.values(gains)) g.disconnect()
      void context.close()
    },
  }
}

/** Equal-power curve: feels more natural than linear gain for fader UIs. */
function equalPower(level: number): number {
  return level * level
}
