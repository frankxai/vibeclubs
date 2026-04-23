/**
 * @frankx/design-core
 *
 * Typed JS export of tokens. Mirrors `tokens.css` + `themes/*.css` so any
 * consumer that cannot import CSS (Node scripts, React Native, MDX frontmatter
 * generators) still has the palette.
 *
 * The CSS files are the source of truth; this file is a convenience mirror.
 */

export const ink = {
  '950': '#06060b',
  '900': '#0a0a0f',
  '850': '#0e0e16',
  '800': '#14141f',
  '700': '#1a1a28',
  '600': '#262637',
  '500': '#34344b',
} as const

export const cream = {
  '50': '#fafaf7',
  '100': '#f7f1e5',
  '200': '#e6dfc9',
} as const

/** Vibeclubs brand palette — matches themes/vibeclubs.css. */
export const vibe = {
  amber: '#f59e0b',
  amberSoft: '#fcd34d',
  amberDeep: '#d97706',
  violet: '#6b3fa0',
  violetSoft: '#8b5cf6',
  violetDeep: '#4c1d95',
  signal: '#4fd18c',
  signalSoft: '#86efac',
  danger: '#ef4444',
  warning: '#fb923c',
} as const

/** FrankX parent-brand palette — matches themes/frankx.css. */
export const frankx = {
  consciousPurple: '#8b5cf6',
  consciousDeep: '#6d28d9',
  techCyan: '#06b6d4',
  techBright: '#67e8f9',
  musicOrange: '#f97316',
  musicWarm: '#fdba74',
  growthGreen: '#10b981',
  growthFresh: '#6ee7b7',
  cosmicPurple: '#ab47c7',
  auroraBlue: '#43bfe3',
  goldAccent: '#f59e0b',
} as const

/** Phase colors — referenced by the vibe mechanics (pomodoro-sync). */
export const phase = {
  idle: vibe.amber,
  focus: vibe.signal,
  break: vibe.violetSoft,
  ship: vibe.amberSoft,
  dance: '#f472b6',
} as const

/** Easing curves used across the ecosystem. */
export const ease = {
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  spring: 'cubic-bezier(0.3, 1.5, 0.5, 1)',
} as const

export const tokens = {
  ink,
  cream,
  vibe,
  frankx,
  phase,
  ease,
} as const

export type Tokens = typeof tokens

/**
 * Compute the seconds-per-beat for a given BPM. Useful when a component
 * wants to drive an animation duration programmatically.
 *
 * @example
 * <div style={{ animation: `vc-beat ${beatDuration(120)}s ease-in-out infinite` }} />
 */
export function beatDuration(bpm: number): number {
  if (bpm <= 0) return 0
  return 60 / bpm
}
