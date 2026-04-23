import { cn } from '@/lib/cn'

type PulseBeatProps = {
  /** Beats per minute. 60 → once per second. Default 95 — the default focus BPM. */
  bpm?: number
  /** Size in pixels. */
  size?: number
  /** Tone override — defaults to amber. */
  tone?: 'amber' | 'signal' | 'violet' | 'current'
  className?: string
}

/**
 * Shared heartbeat visualization. Pulses at the passed BPM via the
 * `.vc-beat` class defined in @frankx/design-core/motion.css. All surfaces
 * (extension overlay, club page, hero badges) that pass the same BPM
 * animate in sync — this is the vibe mechanic #1 "shared tempo."
 */
export function PulseBeat({
  bpm = 95,
  size = 12,
  tone = 'amber',
  className,
}: PulseBeatProps) {
  const color =
    tone === 'signal'
      ? 'var(--color-vibe-signal, #4fd18c)'
      : tone === 'violet'
        ? 'var(--color-vibe-violet-soft, #8b5cf6)'
        : tone === 'current'
          ? 'currentColor'
          : 'var(--color-vibe-amber, #f59e0b)'

  return (
    <span
      className={cn('vc-beat inline-block rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 1.6}px ${color}`,
        // Expose BPM as a CSS var so the .vc-beat animation-duration picks it up.
        // @ts-expect-error — CSS custom property
        '--bpm': bpm,
        '--bpm-seconds': `calc(60 / ${bpm} * 1s)`,
      }}
      aria-hidden
    />
  )
}

/**
 * Ring variant of PulseBeat. Used as a container element where the beat
 * pulses around content (avatar, timer, club card).
 */
export function PulseRing({
  bpm = 95,
  size = 120,
  tone = 'amber',
  className,
  children,
}: PulseBeatProps & { children?: React.ReactNode }) {
  const color =
    tone === 'signal'
      ? 'rgba(79, 209, 140, 0.4)'
      : tone === 'violet'
        ? 'rgba(139, 92, 246, 0.4)'
        : tone === 'current'
          ? 'currentColor'
          : 'rgba(245, 158, 11, 0.4)'

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        // @ts-expect-error — CSS custom property
        '--bpm': bpm,
        '--bpm-seconds': `calc(60 / ${bpm} * 1s)`,
      }}
    >
      <div
        className="vc-beat absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${color}`,
          boxShadow: `inset 0 0 ${size * 0.2}px ${color}`,
        }}
        aria-hidden
      />
      {children}
    </div>
  )
}
