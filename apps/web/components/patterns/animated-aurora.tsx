import { cn } from '@/lib/cn'

/**
 * Evolved AuroraBg with slow drifting radial blobs. Drop-in replacement for
 * `<AuroraBg>` on hero sections where motion adds presence. Falls back to the
 * static gradient when `prefers-reduced-motion` is set (handled via CSS).
 */
export function AnimatedAurora({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div className="vc-aurora-layer vc-aurora-a" />
      <div className="vc-aurora-layer vc-aurora-b" />
      <div className="vc-aurora-layer vc-aurora-c" />
      <div className="vc-grain" />
    </div>
  )
}
