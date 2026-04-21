import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

/**
 * The single Button primitive every surface calls into.
 *
 * Variants map to a meaning, not a color:
 *   primary   → the one CTA on the screen (amber)
 *   secondary → confirmatory, de-emphasized
 *   ghost     → text affordance in dense UI
 *   outline   → outlined secondary, rarer
 *   danger    → destructive intent
 *   signal    → live / active state (green)
 *
 * Sizes map to context, not pixels:
 *   sm  → dense rows
 *   md  → inline with text
 *   lg  → primary CTA in hero + forms
 *   xl  → above-the-fold hero CTA
 */
const buttonStyles = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap',
    'rounded-full transition-all duration-150',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_32px_-8px_rgba(245,158,11,0.6)]',
        secondary: 'bg-white/10 text-white hover:bg-white/15',
        ghost: 'text-white/70 hover:text-white hover:bg-white/5',
        outline: 'border border-white/15 text-white hover:bg-white/5 hover:border-white/25',
        danger: 'bg-red-500 text-white hover:bg-red-400',
        signal:
          'bg-[#4FD18C] text-black hover:bg-[#86efac] shadow-[0_0_28px_-8px_rgba(79,209,140,0.6)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-[0.95rem]',
        xl: 'h-14 px-7 text-base',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonStyles>

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  asChild?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, full, asChild, leading, trailing, children, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp ref={ref} className={cn(buttonStyles({ variant, size, full }), className)} {...rest}>
      {leading}
      {children}
      {trailing}
    </Comp>
  )
})

interface LinkButtonProps extends ButtonVariantProps {
  href: string
  external?: boolean
  children: ReactNode
  className?: string
  leading?: ReactNode
  trailing?: ReactNode
}

/** Link-style Button. Preserves Next.js prefetch while sharing variants. */
export function LinkButton({
  href,
  external,
  className,
  variant,
  size,
  full,
  leading,
  trailing,
  children,
}: LinkButtonProps) {
  const cls = cn(buttonStyles({ variant, size, full }), className)
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {leading}
        {children}
        {trailing}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {leading}
      {children}
      {trailing}
    </Link>
  )
}

export { buttonStyles }
