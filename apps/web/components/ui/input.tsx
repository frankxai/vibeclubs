import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const base =
  'w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 ' +
  'text-white placeholder:text-white/30 ' +
  'focus:outline-none focus:border-amber-400/50 ' +
  'transition-colors text-sm'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(base, className)} {...rest} />
  },
)

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn(base, 'resize-y min-h-[3rem]', className)} {...rest} />
})

interface FieldProps {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
  error?: string | null
}

export function Field({ label, hint, htmlFor, children, error }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className="block">
      <div className="text-sm font-medium mb-1.5">{label}</div>
      {children}
      {hint && !error && <div className="text-xs text-white/40 mt-1.5">{hint}</div>}
      {error && <div className="text-xs text-red-300 mt-1.5">{error}</div>}
    </label>
  )
}
