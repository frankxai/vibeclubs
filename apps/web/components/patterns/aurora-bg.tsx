import { cn } from '@/lib/cn'

/**
 * A subtle aurora gradient background for hero sections.
 * Absolute-positioned; host container should be `relative`.
 */
export function AuroraBg({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div className="vc-aurora" />
      <div className="vc-grain" />
    </div>
  )
}
