'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

type WithChildrenAndClassName<T> = T & {
  children?: ReactNode
  className?: string
}

type DialogContentProps = WithChildrenAndClassName<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>
type DialogTitleProps = WithChildrenAndClassName<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>
type DialogDescriptionProps = WithChildrenAndClassName<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>

const DialogPortal = DialogPrimitive.Portal as unknown as (props: {
  children?: ReactNode
}) => ReactNode
const DialogOverlay = DialogPrimitive.Overlay as unknown as (
  props: ComponentPropsWithoutRef<'div'>
) => ReactNode
const DialogContentPrimitive = DialogPrimitive.Content as unknown as (
  props: DialogContentProps & { ref?: React.Ref<HTMLDivElement> }
) => ReactNode
const DialogTitlePrimitive = DialogPrimitive.Title as unknown as (
  props: DialogTitleProps & { ref?: React.Ref<HTMLHeadingElement> }
) => ReactNode
const DialogDescriptionPrimitive = DialogPrimitive.Description as unknown as (
  props: DialogDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }
) => ReactNode

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        )}
      />
      <DialogContentPrimitive
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
      </DialogContentPrimitive>
    </DialogPortal>
  )
})

export function DialogHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...rest} />
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, ...rest },
  ref,
) {
  return (
    <DialogTitlePrimitive
      ref={ref}
      className={cn('text-xl font-semibold tracking-tight', className)}
      {...rest}
    />
  )
})

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...rest }, ref) {
  return (
    <DialogDescriptionPrimitive
      ref={ref}
      className={cn('text-sm text-white/60 leading-relaxed', className)}
      {...rest}
    />
  )
  },
)
