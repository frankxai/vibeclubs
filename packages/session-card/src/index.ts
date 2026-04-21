/**
 * @vibeclubs/session-card
 *
 * Generates a shareable SVG card summarizing a session. Consumers can render
 * to PNG with satori + resvg, an offscreen canvas, or a server-side wrapper.
 *
 * The card template is intentionally a single function of its data — no
 * runtime configuration, no theming options. Consistency across every card
 * shared to X is a brand feature.
 */

export interface SessionCardData {
  clubName: string
  handle: string
  durationMinutes: number
  pomodoroCycles: number
  platform: string
  date: Date | string
  ambientPreset?: string
}

export function renderSessionCardSVG(data: SessionCardData): string {
  const date = typeof data.date === 'string' ? new Date(data.date) : data.date
  const dateLabel = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // 1200 x 630 — OG card dimensions
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a0f"/>
      <stop offset="1" stop-color="#1a1025"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#fcd34d"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Amber accent dot -->
  <circle cx="100" cy="110" r="8" fill="#f59e0b"/>
  <text x="130" y="120" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#ffffff" opacity="0.8">
    Vibeclubs
  </text>

  <!-- Main stat block -->
  <text x="100" y="280" font-family="Inter, system-ui, sans-serif" font-size="72" font-weight="700" fill="#ffffff">
    ${escapeXml(data.clubName)}
  </text>
  <text x="100" y="340" font-family="Inter, system-ui, sans-serif" font-size="28" fill="#ffffff" opacity="0.6">
    ${escapeXml(data.handle)} · ${escapeXml(dateLabel)}
  </text>

  <!-- Three big numbers -->
  <g transform="translate(100, 430)">
    ${statBlock(0, data.durationMinutes.toString(), 'minutes')}
    ${statBlock(260, data.pomodoroCycles.toString(), 'cycles')}
    ${statBlock(520, prettyPlatform(data.platform), 'platform')}
  </g>

  <!-- Bottom line -->
  <rect x="100" y="570" width="${Math.min(1000, data.durationMinutes * 10)}" height="4" rx="2" fill="url(#accent)"/>
  <text x="1100" y="580" text-anchor="end" font-family="Inter, system-ui, sans-serif" font-size="18" fill="#ffffff" opacity="0.4">
    vibeclubs.ai
  </text>
</svg>`
}

function statBlock(x: number, value: string, label: string): string {
  return `
    <text x="${x}" y="0" font-family="Inter, system-ui, sans-serif" font-size="80" font-weight="700" fill="#f59e0b">
      ${escapeXml(value)}
    </text>
    <text x="${x}" y="36" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#ffffff" opacity="0.5">
      ${escapeXml(label)}
    </text>
  `
}

function prettyPlatform(p: string): string {
  const map: Record<string, string> = {
    meet: 'Meet',
    discord: 'Discord',
    zoom: 'Zoom',
    in_person: 'IRL',
    other: 'Other',
  }
  return map[p] ?? p
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
