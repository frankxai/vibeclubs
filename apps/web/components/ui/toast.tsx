'use client'

import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

/** Drop-in toaster — call `toast.success('...')` from anywhere. */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'rounded-2xl border border-white/10 bg-[#0e0e16] text-white shadow-2xl backdrop-blur-xl',
          title: 'font-medium',
          description: 'text-white/60',
          actionButton: 'bg-amber-400 text-black',
        },
      }}
    />
  )
}

export const toast = sonnerToast
