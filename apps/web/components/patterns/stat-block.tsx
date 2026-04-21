import { cn } from '@/lib/cn'

interface StatBlockProps {
  value: string
  label: string
  tone?: 'amber' | 'signal' | 'violet' | 'white'
  className?: string
}

export function StatBlock({ value, label, tone = 'amber', className }: StatBlockProps) {
  const tones = {
    amber: 'text-amber-400',
    signal: 'text-[#4FD18C]',
    violet: 'text-[#a78bfa]',
    white: 'text-white',
  }
  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/[0.02] p-4', className)}>
      <div className={cn('text-3xl font-bold tabular-nums', tones[tone])}>{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-white/40 mt-1">{label}</div>
    </div>
  )
}

export function Fact({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/[0.02] p-4', className)}>
      <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}
