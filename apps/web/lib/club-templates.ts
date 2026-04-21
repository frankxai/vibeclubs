import type { ClubPlatform, ClubType, PomodoroPreset } from '@/lib/supabase/types'

export interface ClubTemplate {
  id: string
  label: string
  emoji: string
  tagline: string
  defaults: {
    type: ClubType
    platform: ClubPlatform
    pomodoro_preset: PomodoroPreset
    ambient_preset: string
    description: string
  }
}

/**
 * Canonical club templates. Presets are the quickest way for new hosts to go
 * from zero to a live vibeclub — the /start form pre-fills from these via
 * `?template=<id>`.
 *
 * Keep templates opinionated. A well-scoped narrow template beats a generic
 * "any club" form every time.
 */
export const CLUB_TEMPLATES: ClubTemplate[] = [
  {
    id: 'claude-code',
    label: 'Claude Code vibeclub',
    emoji: '◇',
    tagline: 'Ship with Claude Code and friends',
    defaults: {
      type: 'coding',
      platform: 'discord',
      pomodoro_preset: '50_10',
      ambient_preset: 'lofi',
      description:
        'Deep-work with Claude Code + your crew. Ship features, debug flows, land PRs. Lofi on, voice off, type fast.',
    },
  },
  {
    id: 'morning-writers',
    label: 'Morning writers',
    emoji: '☰',
    tagline: 'Ship words before the inbox',
    defaults: {
      type: 'writing',
      platform: 'meet',
      pomodoro_preset: '50_10',
      ambient_preset: 'cafe',
      description:
        'Writers-only. 9am local. Two 50/10 blocks, café ambient. No chat, no critique. Just words on a page.',
    },
  },
  {
    id: 'suno-producers',
    label: 'Suno producers',
    emoji: '♪',
    tagline: 'Generate, arrange, ship tracks',
    defaults: {
      type: 'music',
      platform: 'discord',
      pomodoro_preset: '90_20',
      ambient_preset: 'space',
      description:
        'Suno + Ableton + taste. Generate in the first 20, arrange for 50, share in the break. One track out per session.',
    },
  },
  {
    id: 'design-sprint',
    label: 'Design sprint',
    emoji: '◈',
    tagline: 'Figma dark mode + lo-fi',
    defaults: {
      type: 'design',
      platform: 'meet',
      pomodoro_preset: '50_10',
      ambient_preset: 'lofi',
      description:
        'Dark-mode Figma + cursor ballet. Mid-fi explorations, tight critique in the break. Ship a prototype.',
    },
  },
  {
    id: 'founder-deepwork',
    label: 'Founder deep-work',
    emoji: '◾',
    tagline: 'Strategic work, no meetings',
    defaults: {
      type: 'other',
      platform: 'zoom',
      pomodoro_preset: '90_20',
      ambient_preset: 'rain',
      description:
        'Founders only. One 90-min block. Work on the thing only you can do — strategy, hiring, positioning. No standups allowed.',
    },
  },
  {
    id: 'study-group',
    label: 'Study group',
    emoji: '○',
    tagline: 'Exams, certifications, deep learning',
    defaults: {
      type: 'study',
      platform: 'discord',
      pomodoro_preset: '25_5',
      ambient_preset: 'nature',
      description:
        'Silent co-study. 25/5 pomodoros, four rounds. Nature ambient. Cameras optional but presence required.',
    },
  },
]

export function findTemplate(id: string | null | undefined): ClubTemplate | undefined {
  if (!id) return undefined
  return CLUB_TEMPLATES.find((t) => t.id === id)
}
