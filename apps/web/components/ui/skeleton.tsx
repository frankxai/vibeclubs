import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white/[0.04]',
        'after:absolute after:inset-0 after:-translate-x-full',
        'after:animate-[vc-shimmer_1.6s_ease-in-out_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent',
        className,
      )}
    />
  )
}

// Keyframes referenced above. Tailwind v4 will include them via arbitrary class names.
// A fallback animation in case it doesn't get picked up:
const styleTag = `
@keyframes vc-shimmer {
  100% { transform: translateX(100%); }
}
`
if (typeof document !== 'undefined' && !document.getElementById('vc-skeleton-kf')) {
  const s = document.createElement('style')
  s.id = 'vc-skeleton-kf'
  s.textContent = styleTag
  document.head.appendChild(s)
}
