/**
 * The five OSS packages that ship with Vibeclubs. Single source of truth for
 * /developers and /developers/[pkg]. Edit here, both routes update.
 */

export interface PackageDetail {
  /** Slug used in /developers/[pkg] */
  slug: string
  /** Full npm name */
  name: string
  /** One-line tagline shown in cards */
  tagline: string
  /** 2–3 sentence description for the detail page hero */
  description: string
  /** Lifecycle / scope / dependency notes */
  notes: string[]
  /** Primary import statement */
  importLine: string
  /** Full quickstart code block (multi-line) */
  example: string
  /** API surface — list of exported symbols + one-line each */
  exports: { symbol: string; kind: 'fn' | 'type' | 'const' | 'class'; summary: string }[]
  /** Path inside the monorepo for "view source" */
  sourcePath: string
}

export const PACKAGES: PackageDetail[] = [
  {
    slug: 'vibe-mix',
    name: '@vibeclubs/vibe-mix',
    tagline: 'Three-layer Web Audio mixer.',
    description:
      'Ambient + music + page audio, mixed per-listener with equal-power curves. Optional duck-on-voice. Framework-agnostic — runs in any browser, any extension, any Electron / Tauri shell with Web Audio.',
    notes: [
      'Per-listener mix — DMCA safe by design.',
      'Five ambient presets: lofi, rain, cafe, nature, space.',
      'Page audio respects the host tab’s media session.',
    ],
    importLine: "import { createMixer } from '@vibeclubs/vibe-mix'",
    example: `import { createMixer } from '@vibeclubs/vibe-mix'

const mixer = createMixer({
  ambientBaseUrl: 'https://cdn.vibeclubs.ai/ambient',
  duckOnVoice: true,
})

await mixer.loadAmbient('lofi')
mixer.setLevel('ambient', 0.4)
mixer.setLevel('music', 0.25)
mixer.setLevel('page', 0.85)`,
    exports: [
      { symbol: 'createMixer', kind: 'fn', summary: 'Construct a Mixer with optional config.' },
      {
        symbol: 'Mixer',
        kind: 'type',
        summary: 'Stable handle: setLevel / loadAmbient / dispose.',
      },
      { symbol: 'Layer', kind: 'type', summary: '"ambient" | "music" | "page".' },
    ],
    sourcePath: 'packages/vibe-mix',
  },
  {
    slug: 'pomodoro-sync',
    name: '@vibeclubs/pomodoro-sync',
    tagline: 'Pomodoro state machine + Realtime broadcast.',
    description:
      'Drift-free timer that broadcasts phase changes across every extension tab in the same club. Late-joiners ping for current state. Supports focus / break / ship / dance phases with BPM-aware presets.',
    notes: [
      'Eight presets including vibe_coding_sprint, music_jam, dance_break, lightning.',
      'BPM is first-class state — drives shared visuals across surfaces.',
      'Optional Supabase Realtime channel; works standalone if no client passed.',
    ],
    importLine: "import { createPomodoro } from '@vibeclubs/pomodoro-sync'",
    example: `import { createPomodoro } from '@vibeclubs/pomodoro-sync'

const pomo = createPomodoro({
  clubId: 'lofi-coders-amsterdam',
  preset: 'vibe_coding_sprint',
})

pomo.on('tick', (msRemaining) => render(msRemaining))
pomo.on('ship', (cycle) => openShipMomentOverlay(cycle))
pomo.on('dance', (cycle) => openDanceBreakOverlay(cycle))
pomo.on('complete', (cycle) => logShip(cycle))

pomo.start()`,
    exports: [
      { symbol: 'createPomodoro', kind: 'fn', summary: 'Build a Pomodoro instance.' },
      { symbol: 'bpmForPreset', kind: 'fn', summary: 'Default BPM per preset.' },
      { symbol: 'sequenceForPreset', kind: 'fn', summary: 'Phase sequence array.' },
      {
        symbol: 'Pomodoro',
        kind: 'type',
        summary: 'state / start / pause / reset / on / dispose.',
      },
      {
        symbol: 'PomodoroState',
        kind: 'type',
        summary: 'phase / cycle / startedAt / bpm / hostId.',
      },
    ],
    sourcePath: 'packages/pomodoro-sync',
  },
  {
    slug: 'ai-witness',
    name: '@vibeclubs/ai-witness',
    tagline: 'Claude prompt builder for recaps.',
    description:
      'Pure prompt-construction helper for the recap pattern. Hard-enforces "never interrupt, never coach" in the system prompt. No network — pair with the Vercel AI SDK or any Claude client.',
    notes: [
      'No HTTP calls. Pure inputs → { system, user } strings.',
      'System prompt is identical per deploy → cache it (saves 60–80 % on tokens).',
      'Surfaced to users as "the recap" per the voice system.',
    ],
    importLine: "import { witnessPrompt } from '@vibeclubs/ai-witness'",
    example: `import { witnessPrompt } from '@vibeclubs/ai-witness'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const { system, user } = witnessPrompt({
  type: 'pomodoro_complete',
  club_name: 'lofi-coders-amsterdam',
  cycle_number: 2,
})

const stream = streamText({
  model: anthropic('claude-haiku-4-5-20251001'),
  system,
  prompt: user,
  providerOptions: {
    anthropic: { cacheControl: { type: 'ephemeral' } },
  },
})`,
    exports: [
      { symbol: 'witnessPrompt', kind: 'fn', summary: 'Build { system, user } from an event.' },
      { symbol: 'WitnessEvent', kind: 'type', summary: 'Discriminated union of session events.' },
    ],
    sourcePath: 'packages/ai-witness',
  },
  {
    slug: 'session-card',
    name: '@vibeclubs/session-card',
    tagline: 'SVG session card renderer.',
    description:
      'Deterministic 1200×630 SVG generator for shareable session summaries. Single-function API — same data always renders the same card. Brand-locked typography + amber accent.',
    notes: [
      'Pure render — no fonts, no fetches, no surprises.',
      'Same 1200×630 dims as Twitter / OG cards. Drop into next/og or convert via resvg.',
      'XML-escaped values — safe to render any user-supplied club name.',
    ],
    importLine: "import { renderSessionCardSVG } from '@vibeclubs/session-card'",
    example: `import { renderSessionCardSVG } from '@vibeclubs/session-card'

const svg = renderSessionCardSVG({
  clubName: 'lofi-coders-amsterdam',
  handle: '@frankx',
  durationMinutes: 90,
  pomodoroCycles: 3,
  platform: 'discord',
  date: new Date(),
})

// Use directly (web), or convert to PNG via resvg / satori for Twitter cards.
fs.writeFileSync('card.svg', svg)`,
    exports: [
      { symbol: 'renderSessionCardSVG', kind: 'fn', summary: 'Render a card from session data.' },
      {
        symbol: 'SessionCardData',
        kind: 'type',
        summary: 'clubName / handle / minutes / cycles / …',
      },
    ],
    sourcePath: 'packages/session-card',
  },
  {
    slug: 'suno-bridge',
    name: '@vibeclubs/suno-bridge',
    tagline: 'Suno API wrapper with fallback.',
    description:
      'Generative-music client for the music fader. Reads club genre + time-of-day to build prompts. Falls back to a curated royalty-free library when Suno is rate-limited or unavailable.',
    notes: [
      'Two-mode: live Suno API or curated fallback. Same return type.',
      'Prompt helper reads BPM from pomodoro-sync — keeps the music in tempo.',
      'Pro-tier-only feature in the hosted instance; OSS path can run with own keys.',
    ],
    importLine: "import { generateMusic } from '@vibeclubs/suno-bridge'",
    example: `import { generateMusic } from '@vibeclubs/suno-bridge'
import { bpmForPreset } from '@vibeclubs/pomodoro-sync'

const track = await generateMusic({
  apiKey: process.env.SUNO_API_KEY,
  genre: 'lofi-hip-hop',
  bpm: bpmForPreset('vibe_coding_sprint'),
  durationMinutes: 22,
})

// track.url plays through the music layer of vibe-mix.`,
    exports: [
      { symbol: 'generateMusic', kind: 'fn', summary: 'Generate a track or pull a fallback URL.' },
      { symbol: 'GenerateMusicOptions', kind: 'type', summary: 'apiKey / genre / bpm / duration.' },
    ],
    sourcePath: 'packages/suno-bridge',
  },
]

export function findPackage(slug: string): PackageDetail | undefined {
  return PACKAGES.find((p) => p.slug === slug)
}
