import { cn } from '@/lib/cn'

interface TimerDisplayProps {
  mmss: string
  phase?: 'focus' | 'break' | 'idle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Big monospace timer readout used by the extension overlay, club pages, and
 * the landing-page recap preview. The color shifts by phase — signal-green for
 * focus, violet for break, white muted for idle.
 */
export function TimerDisplay({ mmss, phase = 'idle', size = 'md', className }: TimerDisplayProps) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  }
  const tone =
    phase === 'focus'
      ? 'text-[#4FD18C]'
      : phase === 'break'
        ? 'text-[#a78bfa]'
        : 'text-amber-400'

  return (
    <div
      className={cn(
        'font-mono font-bold tracking-tight tabular-nums',
        sizes[size],
        tone,
        className,
      )}
    >
      {mmss}
    </div>
  )
}
