/**
 * Static club directory — reads `content/clubs/*.md` at build time and
 * exposes the parsed clubs for use in `/explore` and `/club/[slug]`.
 *
 * This is the OSS-first path (ADR-002 sovereignty posture): a vibeclub can
 * be listed with a PR and a markdown file, zero backend. The Supabase path
 * layers on top for hosted/private clubs; the two sources merge at read time
 * with static clubs taking precedence on slug collision.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ClubPlatform, ClubType, PomodoroPreset } from '@/lib/supabase/types'

export interface StaticClub {
  slug: string
  name: string
  host: string
  platform: ClubPlatform
  type: ClubType
  preset: PomodoroPreset
  ambient: string
  schedule: string
  platform_url?: string
  featured?: boolean
  location?: string
  /** Body copy from the MD file (everything after the frontmatter). */
  description: string
  /** Always 'static' for this reader — lets UIs distinguish source. */
  source: 'static'
}

const CONTENT_DIR = join(process.cwd(), '..', '..', 'content', 'clubs')

/**
 * Cheap frontmatter parser — avoids pulling in gray-matter for a schema this
 * small. Expects: top of file begins with `---\n`, frontmatter, `---\n`, then
 * body. Values are strings or booleans; no nested objects, no arrays.
 */
function parseFrontmatter(raw: string): { data: Record<string, string | boolean>; body: string } {
  if (!raw.startsWith('---\n')) {
    return { data: {}, body: raw }
  }
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) {
    return { data: {}, body: raw }
  }
  const fmBlock = raw.slice(4, end)
  const body = raw.slice(end + 5).trim()
  const data: Record<string, string | boolean> = {}
  for (const line of fmBlock.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (!key) continue
    // Strip surrounding quotes if present
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }
    if (value === 'true') {
      data[key] = true
    } else if (value === 'false') {
      data[key] = false
    } else {
      data[key] = value
    }
  }
  return { data, body }
}

function parseClub(filename: string, raw: string): StaticClub | null {
  const { data, body } = parseFrontmatter(raw)
  const slug = filename.replace(/\.md$/, '')
  if (!data.name || !data.host) return null
  return {
    slug,
    name: String(data.name),
    host: String(data.host),
    platform: (data.platform ?? 'other') as ClubPlatform,
    type: (data.type ?? 'other') as ClubType,
    preset: (data.preset ?? '25_5') as PomodoroPreset,
    ambient: String(data.ambient ?? 'lofi'),
    schedule: String(data.schedule ?? ''),
    platform_url: typeof data.platform_url === 'string' ? data.platform_url : undefined,
    featured: data.featured === true,
    location: typeof data.location === 'string' ? data.location : undefined,
    description: body,
    source: 'static',
  }
}

let cache: StaticClub[] | null = null

/**
 * Load all static clubs. Cached after first call — safe because the content
 * directory is read-only at runtime (changes require a redeploy).
 */
export function loadStaticClubs(): StaticClub[] {
  if (cache) return cache
  if (!existsSync(CONTENT_DIR)) {
    cache = []
    return cache
  }
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
  const clubs: StaticClub[] = []
  for (const file of files) {
    try {
      const raw = readFileSync(join(CONTENT_DIR, file), 'utf8')
      const club = parseClub(file, raw)
      if (club) clubs.push(club)
    } catch {
      // Swallow individual file failures; a broken frontmatter file shouldn't
      // take down the whole directory render.
    }
  }
  // Featured first, then alphabetical.
  clubs.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  cache = clubs
  return cache
}

/**
 * Find a single static club by slug. O(n) — fine for directory sizes we
 * expect (< 1000 entries). If this ever ships with 10k+, swap to a map.
 */
export function findStaticClub(slug: string): StaticClub | undefined {
  return loadStaticClubs().find((c) => c.slug === slug)
}
