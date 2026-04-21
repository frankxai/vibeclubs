import { cn } from '@/lib/cn'

const widths = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1200px]',
  '2xl': 'max-w-[1400px]',
}

export function Container({
  children,
  width = 'xl',
  className,
  as: Comp = 'div',
}: {
  children: React.ReactNode
  width?: keyof typeof widths
  className?: string
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer'
}) {
  return <Comp className={cn('mx-auto w-full px-6', widths[width], className)}>{children}</Comp>
}

export function Section({
  children,
  className,
  border = false,
  pad = 'lg',
}: {
  children: React.ReactNode
  className?: string
  border?: boolean
  pad?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}) {
  const padMap = {
    none: '',
    sm: 'py-10',
    md: 'py-16',
    lg: 'py-24',
    xl: 'py-32',
  }
  return (
    <section
      className={cn(padMap[pad], border && 'border-t border-white/5', className)}
    >
      {children}
    </section>
  )
}

export function Eyebrow({
  children,
  tone = 'amber',
  className,
}: {
  children: React.ReactNode
  tone?: 'amber' | 'signal' | 'violet'
  className?: string
}) {
  const tones = {
    amber: 'text-amber-300',
    signal: 'text-[#4FD18C]',
    violet: 'text-[#a78bfa]',
  }
  return (
    <div
      className={cn(
        'text-[11px] uppercase tracking-[0.22em] font-mono',
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('flex items-start justify-between gap-6 flex-wrap', className)}>
      <div className="flex-1 min-w-0">
        {eyebrow && <div className="mb-3">{eyebrow}</div>}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.02]">{title}</h1>
        {subtitle && (
          <p className="text-lg text-white/60 mt-5 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </header>
  )
}
