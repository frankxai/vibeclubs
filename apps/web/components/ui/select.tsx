import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectProps<T extends string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  value: T
}

export const Select = forwardRef(function Select<T extends string>(
  { options, value, onChange, className, ...rest }: SelectProps<T>,
  ref: React.Ref<HTMLSelectElement>,
) {
  return (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn(
        'w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3',
        'text-white text-sm',
        'focus:outline-none focus:border-amber-400/50 transition-colors',
        'appearance-none bg-[right_0.75rem_center] bg-no-repeat',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#14141f]">
          {o.label}
        </option>
      ))}
    </select>
  )
}) as <T extends string>(props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> }) => JSX.Element
