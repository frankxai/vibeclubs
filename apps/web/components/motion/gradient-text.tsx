import { createElement, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'warm' | 'cool' | 'signal'

type Tag = 'span' | 'div' | 'strong' | 'em' | 'h1' | 'h2' | 'h3' | 'h4'

type GradientTextProps = {
  as?: Tag
  className?: string
  children: ReactNode
  tone?: Tone
}

/**
 * Pure CSS gradient text with a slow conic drift. Used sparingly on hero
 * signature lines. Reduced-motion path handled in globals.css.
 */
export function GradientText({
  as = 'span',
  className,
  children,
  tone = 'warm',
}: GradientTextProps) {
  return createElement(
    as,
    { className: cn('vc-gradient-text', `vc-gradient-text--${tone}`, className) },
    children,
  )
}
