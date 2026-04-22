import { cn } from '@/lib/cn'

type SparkOrbProps = {
  size?: number
  className?: string
  hue?: 'amber' | 'violet' | 'dual'
}

/**
 * CSS-only 3D-feel orb. Zero-dependency.
 *
 * Composes a layered radial gradient with a slow drift animation to create
 * the illusion of a glowing sphere behind hero content. Respects
 * `prefers-reduced-motion` via the `vc-orb-drift` keyframe falling back to no
 * motion when the user opts out (handled in globals.css).
 */
export function SparkOrb({ size = 520, className, hue = 'dual' }: SparkOrbProps) {
  const gradient =
    hue === 'amber'
      ? 'radial-gradient(circle at 32% 28%, rgba(252, 211, 77, 0.55), rgba(245, 158, 11, 0.35) 28%, rgba(217, 119, 6, 0.12) 55%, transparent 75%)'
      : hue === 'violet'
        ? 'radial-gradient(circle at 32% 28%, rgba(139, 92, 246, 0.5), rgba(107, 63, 160, 0.32) 30%, rgba(76, 29, 149, 0.14) 55%, transparent 75%)'
        : 'radial-gradient(circle at 30% 26%, rgba(252, 211, 77, 0.42), rgba(245, 158, 11, 0.28) 22%, rgba(139, 92, 246, 0.22) 48%, rgba(107, 63, 160, 0.14) 65%, transparent 80%)'

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute select-none', className)}
      style={{ width: size, height: size }}
    >
      <div
        className="vc-orb absolute inset-0 rounded-full"
        style={{
          background: gradient,
          filter: 'blur(12px) saturate(140%)',
        }}
      />
      <div
        className="vc-orb-inner absolute inset-[18%] rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle at 40% 35%, rgba(255, 255, 255, 0.35), transparent 55%)',
          filter: 'blur(18px)',
        }}
      />
    </div>
  )
}
