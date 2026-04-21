import { cn } from '@/lib/cn'

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5',
        'px-1.5 py-0.5 text-[11px] font-mono text-white/70 shadow-[inset_0_-1px_0_rgba(0,0,0,0.4)]',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
