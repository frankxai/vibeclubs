/**
 * Curated tool recommendations per club type.
 *
 * Surfaced on /club/[slug] when the Supabase tool_recommendations table is
 * empty (or unprovisioned). Treated as a fallback layer the same way
 * loadStaticClubs() backstops the directory.
 *
 * Editing rules:
 * - Five entries max per type. Don't turn this into a directory.
 * - No affiliate URLs that require a login to verify (per ADR-002 §vetoes).
 * - Tool name is the canonical brand spelling. Description is one sentence,
 *   builder-grammar, voice-clean (vibeclub / host / crew / lock in / ship).
 */

import type { ClubType, ToolRecommendationRow } from '@/lib/supabase/types'

export interface StaticTool {
  tool_name: string
  tool_url: string
  category: string
  description: string
  affiliate_url?: string
  is_featured?: boolean
}

const COMMON: StaticTool[] = [
  {
    tool_name: 'Discord',
    tool_url: 'https://discord.com',
    category: 'voice',
    description: 'Persistent voice channel for the crew. Free, low-latency, works on every OS.',
  },
  {
    tool_name: 'Google Meet',
    tool_url: 'https://meet.google.com',
    category: 'video',
    description: 'One-click video call. The Vibeclubs extension overlays the mixer + timer here.',
  },
]

const TOOLS_BY_TYPE: Record<ClubType, StaticTool[]> = {
  coding: [
    {
      tool_name: 'Claude Code',
      tool_url: 'https://claude.com/claude-code',
      category: 'editor',
      description: 'Anthropic CLI for vibe coding. Pair-programmer that ships, not chatters.',
      is_featured: true,
    },
    {
      tool_name: 'Cursor',
      tool_url: 'https://cursor.sh',
      category: 'editor',
      description: 'AI-first editor. Tab-complete with Claude or GPT in the loop.',
    },
    {
      tool_name: 'GitHub',
      tool_url: 'https://github.com',
      category: 'source',
      description: 'PRs, issues, the receipts. Cards link to the merged commit when you ship.',
    },
    ...COMMON,
  ],
  music: [
    {
      tool_name: 'Suno',
      tool_url: 'https://suno.com',
      category: 'gen',
      description: 'Generative tracks. Pro tier wires it directly into the music fader.',
      is_featured: true,
    },
    {
      tool_name: 'Ableton Live',
      tool_url: 'https://ableton.com',
      category: 'daw',
      description: 'Production DAW most music vibeclubs run. Loop the project, ship the bounce.',
    },
    {
      tool_name: 'Splice',
      tool_url: 'https://splice.com',
      category: 'samples',
      description: 'Sample marketplace. Crews share kit lists in the club description.',
    },
    ...COMMON,
  ],
  design: [
    {
      tool_name: 'Figma',
      tool_url: 'https://figma.com',
      category: 'design',
      description: 'Multiplayer canvas. Crews lock the same file during the focus block.',
      is_featured: true,
    },
    {
      tool_name: 'Linear',
      tool_url: 'https://linear.app',
      category: 'planning',
      description: 'Tickets the design crew picks up at the start of each cycle.',
    },
    ...COMMON,
  ],
  study: [
    {
      tool_name: 'Anki',
      tool_url: 'https://apps.ankiweb.net',
      category: 'study',
      description: 'Spaced repetition. Two cycles of cards, one cycle of free review.',
    },
    {
      tool_name: 'Obsidian',
      tool_url: 'https://obsidian.md',
      category: 'notes',
      description: 'Local-first notes. Each cycle ends with one new note in the daily file.',
    },
    ...COMMON,
  ],
  fitness: [
    {
      tool_name: 'Strong',
      tool_url: 'https://strong.app',
      category: 'tracking',
      description: 'Log lifts during the rest periods. Card shows total volume at session end.',
    },
    {
      tool_name: 'Hevy',
      tool_url: 'https://hevy.com',
      category: 'tracking',
      description:
        'Free workout tracker. Crew shares the routine; everyone follows the same blocks.',
    },
  ],
  writing: [
    {
      tool_name: 'iA Writer',
      tool_url: 'https://ia.net/writer',
      category: 'editor',
      description:
        'Distraction-free writing. Word counts at the end of each cycle become the recap.',
      is_featured: true,
    },
    {
      tool_name: 'Notion',
      tool_url: 'https://notion.so',
      category: 'editor',
      description: 'Crews ship to a shared Notion page during ship moments.',
    },
    ...COMMON,
  ],
  other: COMMON,
}

/**
 * Static tool list shaped to match the ToolRecommendationRow contract — lets
 * the /club/[slug] render code stay source-agnostic.
 */
export function getStaticToolsForType(type: ClubType): ToolRecommendationRow[] {
  const tools = TOOLS_BY_TYPE[type] ?? COMMON
  return tools.map((t, i) => ({
    id: `static-${type}-${i}`,
    club_type: type,
    tool_name: t.tool_name,
    tool_url: t.tool_url,
    category: t.category,
    description: t.description,
    affiliate_url: t.affiliate_url ?? null,
    is_featured: t.is_featured ?? false,
    created_at: new Date(0).toISOString(),
  }))
}
