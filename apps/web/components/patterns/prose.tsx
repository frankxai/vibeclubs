import { cn } from '@/lib/cn'

export function Prose({
  children,
  className,
  as: Comp = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}) {
  return <Comp className={cn('vc-prose', className)}>{children}</Comp>
}
