import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeStyles = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-white/5 text-white/70 border border-white/10',
        amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
        signal: 'bg-[#4FD18C]/10 text-[#86efac] border border-[#4FD18C]/30',
        violet: 'bg-[#6b3fa0]/10 text-[#c4b5fd] border border-[#6b3fa0]/30',
        outline: 'border border-white/15 text-white/80',
      },
      size: {
        xs: 'text-[10px] px-2 py-0.5 uppercase tracking-[0.12em]',
        sm: 'text-xs px-2.5 py-1',
        md: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'sm',
    },
  },
)

interface BadgeProps extends VariantProps<typeof badgeStyles> {
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ tone, size, dot, className, children }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ tone, size }), className)}>
      {dot && (
        <span
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            tone === 'signal' && 'bg-[#4FD18C]',
            tone === 'amber' && 'bg-amber-400',
            tone === 'violet' && 'bg-[#a78bfa]',
            (!tone || tone === 'neutral' || tone === 'outline') && 'bg-white/60',
          )}
        />
      )}
      {children}
    </span>
  )
}
