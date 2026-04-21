import { Card } from '@/components/ui'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  title: string
  description?: React.ReactNode
  cta?: React.ReactNode
  icon?: string
  className?: string
}

export function EmptyState({ title, description, cta, icon = '·', className }: EmptyStateProps) {
  return (
    <Card pad="xl" className={cn('text-center', className)}>
      <div className="text-5xl mb-4 opacity-40 font-mono">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && (
        <div className="text-white/50 max-w-md mx-auto mb-6 leading-relaxed text-sm">
          {description}
        </div>
      )}
      {cta && <div className="flex justify-center">{cta}</div>}
    </Card>
  )
}
