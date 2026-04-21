import { cn } from '@/lib/cn'
import type { ClubPlatform, ClubType } from '@/lib/supabase/types'

const PLATFORM_LABEL: Record<ClubPlatform, string> = {
  meet: 'Google Meet',
  discord: 'Discord',
  zoom: 'Zoom',
  in_person: 'In person',
  other: 'Other',
}

const TYPE_LABEL: Record<ClubType, string> = {
  coding: 'Coding',
  music: 'Music',
  design: 'Design',
  study: 'Study',
  fitness: 'Fitness',
  writing: 'Writing',
  other: 'Other',
}

const TYPE_COLOR: Record<ClubType, string> = {
  coding: 'text-amber-300 border-amber-400/30',
  music: 'text-[#a78bfa] border-[#a78bfa]/30',
  design: 'text-[#f472b6] border-[#f472b6]/30',
  study: 'text-[#60a5fa] border-[#60a5fa]/30',
  fitness: 'text-[#4FD18C] border-[#4FD18C]/30',
  writing: 'text-[#fcd34d] border-[#fcd34d]/30',
  other: 'text-white/70 border-white/15',
}

export function PlatformPill({
  platform,
  className,
}: {
  platform: ClubPlatform
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border',
        'border-white/10 text-white/70 bg-white/5',
        className,
      )}
    >
      {PLATFORM_LABEL[platform]}
    </span>
  )
}

export function TypePill({ type, className }: { type: ClubType; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border bg-white/[0.02]',
        TYPE_COLOR[type],
        className,
      )}
    >
      {TYPE_LABEL[type]}
    </span>
  )
}
