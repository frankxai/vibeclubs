import { Card, Badge } from '@/components/ui'
import { cn } from '@/lib/cn'

interface TierProps {
  name: string
  price: string
  tag?: string
  points: string[]
  featured?: boolean
  cta?: React.ReactNode
}

export function TierCard({ name, price, tag, points, featured, cta }: TierProps) {
  return (
    <Card tone={featured ? 'featured' : 'base'} pad="lg" className={cn('relative')}>
      {featured && (
        <div className="absolute -top-3 left-6">
          <Badge tone="amber" size="xs">
            Summer 2026
          </Badge>
        </div>
      )}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="text-lg font-semibold">{name}</div>
          {tag && <div className="text-xs text-white/40 mt-0.5">{tag}</div>}
        </div>
        <div className="text-2xl font-bold tabular-nums">{price}</div>
      </div>
      <ul className="space-y-2.5 text-sm text-white/70 mb-6">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className={cn(featured ? 'text-amber-400' : 'text-white/30')}>·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {cta}
    </Card>
  )
}
