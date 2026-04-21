'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'

interface FaderProps {
  label: string
  defaultValue?: number
  onChange?: (value: number) => void
  className?: string
  accent?: 'amber' | 'violet' | 'signal'
  disabled?: boolean
}

/**
 * A styled range fader used in the extension overlay and in design surfaces
 * that visualize the three-layer mixer. Equal-power mapping is applied at the
 * audio engine layer (packages/vibe-mix) — the fader UI is pure linear 0–100.
 */
export function Fader({
  label,
  defaultValue = 30,
  onChange,
  className,
  accent = 'amber',
  disabled,
}: FaderProps) {
  const [value, setValue] = useState(defaultValue)

  const accentClass =
    accent === 'violet'
      ? '[&::-webkit-slider-thumb]:bg-[#a78bfa]'
      : accent === 'signal'
        ? '[&::-webkit-slider-thumb]:bg-[#4FD18C]'
        : '[&::-webkit-slider-thumb]:bg-amber-400'

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="w-20 text-[11px] uppercase tracking-wider text-white/50">{label}</span>
      <div className="flex-1 relative">
        <div className="absolute inset-y-1/2 left-0 right-0 h-[2px] -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r"
          style={{
            width: `${value}%`,
            background:
              accent === 'violet'
                ? 'linear-gradient(to right, #6b3fa0, #a78bfa)'
                : accent === 'signal'
                  ? 'linear-gradient(to right, #4FD18C, #86efac)'
                  : 'linear-gradient(to right, #d97706, #f59e0b)',
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const next = Number(e.target.value)
            setValue(next)
            onChange?.(next / 100)
          }}
          className={cn(
            'relative w-full appearance-none bg-transparent cursor-pointer',
            'h-6',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-4',
            '[&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:border-0',
            accentClass,
          )}
        />
      </div>
      <span className="w-8 text-right text-[11px] font-mono text-white/40">{value}</span>
    </div>
  )
}
