'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DialogContent({ className, children, ...rest }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        )}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-lg rounded-3xl border border-white/10 bg-[#0e0e16] p-6 shadow-2xl',
          'focus:outline-none',
          className,
        )}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})

export function DialogHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...rest} />
}

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-xl font-semibold tracking-tight', className)}
      {...rest}
    />
  )
})

export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-white/60 leading-relaxed', className)}
      {...rest}
    />
  )
})
