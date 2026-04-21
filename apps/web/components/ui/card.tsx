import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const cardStyles = cva('rounded-3xl border transition-colors', {
  variants: {
    tone: {
      base: 'border-white/10 bg-white/[0.02]',
      subtle: 'border-white/5 bg-white/[0.01]',
      featured: 'border-amber-400/40 bg-amber-400/[0.04]',
      signal: 'border-[#4FD18C]/30 bg-[#4FD18C]/[0.03]',
      danger: 'border-red-500/30 bg-red-500/[0.04]',
    },
    pad: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
    interactive: {
      true: 'hover:border-amber-500/30 hover:bg-white/[0.04]',
    },
  },
  defaultVariants: {
    tone: 'base',
    pad: 'md',
  },
})

type CardVariants = VariantProps<typeof cardStyles>

export interface CardProps extends HTMLAttributes<HTMLDivElement>, CardVariants {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, tone, pad, interactive, ...rest },
  ref,
) {
  return <div ref={ref} className={cn(cardStyles({ tone, pad, interactive }), className)} {...rest} />
})

export function CardEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'text-[11px] font-mono uppercase tracking-[0.18em] text-white/40 mb-2',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
  as: Comp = 'h3',
}: {
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}) {
  return <Comp className={cn('text-xl font-semibold leading-tight', className)}>{children}</Comp>
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-sm text-white/60 leading-relaxed', className)}>{children}</div>
}
