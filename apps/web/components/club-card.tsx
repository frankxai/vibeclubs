import Link from 'next/link'
import { Badge, PlatformPill, TypePill } from '@/components/ui'
import type { ClubPlatform, ClubRow, ClubType, PomodoroPreset } from '@/lib/supabase/types'

/**
 * Minimal shape a club needs to render in a card. Both Supabase rows and
 * static MD-backed clubs satisfy this interface, letting the directory
 * merge both sources without adapters per surface.
 */
export interface DirectoryClub {
  slug: string
  name: string
  description: string | null
  type: ClubType
  platform: ClubPlatform
  pomodoro_preset: PomodoroPreset
  featured?: boolean
  source?: 'static' | 'supabase'
}

function prettyPreset(p: PomodoroPreset) {
  switch (p) {
    case '25_5':
      return '25 / 5'
    case '50_10':
      return '50 / 10'
    case '90_20':
      return '90 / 20'
    case 'vibe_coding_sprint':
      return 'Sprint · 22 / 3'
    case 'music_jam':
      return 'Music jam · 90'
    case 'dance_break':
      return 'Dance break · 25 / 5'
    case 'lightning':
      return 'Lightning · 10 / 2'
    default:
      return 'Custom'
  }
}

export function ClubCard({
  club,
  memberCount,
}: {
  club: DirectoryClub | ClubRow
  memberCount?: number
}) {
  const featured = 'featured' in club && club.featured === true
  const tierFeatured = 'tier' in club && club.tier === 'featured'
  const isFeatured = featured || tierFeatured
  const source = 'source' in club ? club.source : undefined

  return (
    <Link
      href={`/club/${club.slug}`}
      className="group rounded-3xl p-6 border border-white/10 bg-white/[0.02] hover:border-amber-500/30 hover:bg-white/[0.04] transition block"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <TypePill type={club.type} />
        <div className="flex items-center gap-2">
          {source === 'static' && (
            <Badge tone="outline" size="xs">
              OSS
            </Badge>
          )}
          {isFeatured && (
            <Badge tone="amber" size="xs">
              Featured
            </Badge>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1 leading-tight group-hover:text-amber-300 transition">
        {club.name}
      </h3>
      <p className="text-sm text-white/60 line-clamp-2 mb-5 min-h-[2.5rem]">
        {club.description || 'A quiet place to make things together.'}
      </p>
      <div className="flex items-center justify-between text-xs text-white/40 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <PlatformPill platform={club.platform} />
          <span className="text-white/30">·</span>
          <span className="font-mono">{prettyPreset(club.pomodoro_preset)}</span>
        </div>
        {memberCount != null && <span>{memberCount} in the crew</span>}
      </div>
    </Link>
  )
}
