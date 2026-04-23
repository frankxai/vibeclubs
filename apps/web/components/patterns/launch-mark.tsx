import { cn } from '@/lib/cn'

type LaunchMarkProps = {
  size?: number
  className?: string
  /** Pause the orbital animation — used in OG images and reduced-motion */
  static?: boolean
}

/**
 * The Vibeclubs launch mark. Pure SVG + CSS.
 * Two orbs — amber + violet — orbit a shared axis. Signal-green core pulses.
 * Deterministic for OG render (with `static`); animates for on-site display.
 */
export function LaunchMark({ size = 120, className, static: isStatic }: LaunchMarkProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('vc-launch-mark block', !isStatic && 'vc-launch-mark--animated', className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="vc-mark-amber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="1" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vc-mark-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
          <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#6b3fa0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vc-mark-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#86efac" stopOpacity="1" />
          <stop offset="60%" stopColor="#4fd18c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4fd18c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer orbit ring — thin */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
      />

      {/* Signal-green core — pulses */}
      <circle cx={cx} cy={cy} r={size * 0.14} fill="url(#vc-mark-core)" className="vc-mark-core" />
      <circle cx={cx} cy={cy} r={size * 0.08} fill="#4fd18c" className="vc-mark-core-inner" />

      {/* Orbital group — rotates, carries the two orbs */}
      <g className="vc-mark-orbit" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {/* Amber orb */}
        <circle cx={cx + r} cy={cy} r={size * 0.12} fill="url(#vc-mark-amber)" />
        {/* Violet orb — opposite side */}
        <circle cx={cx - r} cy={cy} r={size * 0.12} fill="url(#vc-mark-violet)" />
      </g>
    </svg>
  )
}
