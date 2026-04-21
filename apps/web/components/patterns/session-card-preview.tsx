import { cn } from '@/lib/cn'

interface SessionCardPreviewProps {
  clubName: string
  handle: string
  minutes: number
  cycles: number
  platform?: string
  date?: string
  className?: string
}

/**
 * A 4:5 miniature of the shareable session card. Used on the landing hero and
 * on user profiles. The real image generator is in packages/session-card (SVG)
 * and at /api/og (PNG). This component is the in-app preview only.
 */
export function SessionCardPreview({
  clubName,
  handle,
  minutes,
  cycles,
  platform = 'Discord',
  date = 'Apr 20 2026',
  className,
}: SessionCardPreviewProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl border border-white/10 p-7 aspect-[4/5] flex flex-col justify-between overflow-hidden',
        className,
      )}
      style={{
        background:
          'linear-gradient(145deg, rgba(10,10,15,1) 0%, rgba(26,16,37,1) 55%, rgba(42,20,53,1) 100%)',
      }}
    >
      {/* corner glow */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 60%)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 text-white/50 text-xs mb-6">
          <div className="live-dot" />
          Vibeclubs
        </div>
        <div className="text-[11px] text-white/40 font-mono">
          {handle} · {date}
        </div>
        <div className="text-lg font-semibold mt-1">{clubName}</div>
      </div>

      <div className="relative space-y-0.5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Shipped</div>
        <div className="text-6xl font-bold text-amber-400 tabular-nums leading-none">{minutes}</div>
        <div className="text-xs text-white/50 uppercase tracking-wider">minutes</div>
        <div className="flex items-baseline gap-2 mt-3">
          <div className="text-3xl font-bold tabular-nums">{cycles}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">cycles</div>
          <div className="flex-1" />
          <div className="text-[11px] text-white/40">{platform}</div>
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        <div
          className="h-0.5 flex-1 mr-3 rounded-full"
          style={{
            background: 'linear-gradient(to right, #d97706, #fcd34d)',
            width: `${Math.min(100, minutes)}%`,
          }}
        />
        <div className="text-[11px] font-mono text-amber-300">vibeclubs.ai</div>
      </div>
    </div>
  )
}
