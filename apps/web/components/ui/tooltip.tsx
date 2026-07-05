'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider

type TooltipRootProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
  children?: ReactNode
  className?: string
}
type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> & {
  children?: ReactNode
  className?: string
  asChild?: boolean
}
type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  children?: ReactNode
  className?: string
}
type TooltipArrowProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow> & {
  className?: string
}

const TooltipRootPrimitive = TooltipPrimitive.Root as unknown as (
  props: TooltipRootProps,
) => ReactNode
const TooltipTriggerPrimitive = TooltipPrimitive.Trigger as unknown as (
  props: TooltipTriggerProps,
) => ReactNode
const TooltipPortalPrimitive = TooltipPrimitive.Portal as unknown as (props: {
  children?: ReactNode
}) => ReactNode
const TooltipContentPrimitive = TooltipPrimitive.Content as unknown as (
  props: TooltipContentProps,
) => ReactNode
const TooltipArrowPrimitive = TooltipPrimitive.Arrow as unknown as (
  props: TooltipArrowProps,
) => ReactNode

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
}

export function Tooltip({ content, children, side = 'top', delayDuration = 200 }: TooltipProps) {
  return (
    <TooltipRootPrimitive delayDuration={delayDuration}>
      <TooltipTriggerPrimitive asChild>{children}</TooltipTriggerPrimitive>
      <TooltipPortalPrimitive>
        <TooltipContentPrimitive
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 rounded-lg border border-white/10 bg-[#0e0e16] px-2.5 py-1.5',
            'text-xs text-white/80 shadow-lg',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          {content}
          <TooltipArrowPrimitive className="fill-[#0e0e16] stroke-white/10" />
        </TooltipContentPrimitive>
      </TooltipPortalPrimitive>
    </TooltipRootPrimitive>
  )
}

export function TooltipRoot(props: TooltipRootProps) {
  return <TooltipRootPrimitive {...props} />
}
