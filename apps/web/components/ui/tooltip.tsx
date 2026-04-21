'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
}

export function Tooltip({ content, children, side = 'top', delayDuration = 200 }: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 rounded-lg border border-white/10 bg-[#0e0e16] px-2.5 py-1.5',
            'text-xs text-white/80 shadow-lg',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-[#0e0e16] stroke-white/10" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

export const TooltipRoot = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
>(function TooltipRoot(props, _ref) {
  return <TooltipPrimitive.Root {...props} />
})
