import Link from 'next/link'
import { Badge, PlatformPill, TypePill } from '@/components/ui'
import type { ClubRow } from '@/lib/supabase/types'

function prettyPreset(p: ClubRow['pomodoro_preset']) {
  switch (p) {
    case '25_5':
      return '25 / 5'
    case '50_10':
      return '50 / 10'
    case '90_20':
      return '90 / 20'
    default:
      return 'Custom'
  }
}

export function ClubCard({ club, memberCount }: { club: ClubRow; memberCount?: number }) {
  return (
    <Link
      href={`/club/${club.slug}`}
      className="group rounded-3xl p-6 border border-white/10 bg-white/[0.02] hover:border-amber-500/30 hover:bg-white/[0.04] transition block"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <TypePill type={club.type} />
        {club.tier === 'featured' && (
          <Badge tone="amber" size="xs">
            Featured
          </Badge>
        )}
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
