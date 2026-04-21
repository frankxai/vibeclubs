import { cn } from '@/lib/cn'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-sm',
  xl: 'w-20 h-20 text-base',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = (name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={cn('rounded-full object-cover shrink-0', sizeMap[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'rounded-full shrink-0 flex items-center justify-center',
        'bg-gradient-to-br from-amber-400 to-purple-500 text-black font-semibold',
        sizeMap[size],
        className,
      )}
    >
      {initials || '·'}
    </div>
  )
}
