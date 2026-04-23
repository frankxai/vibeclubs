'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'
import type { TimerPhase } from './timer-ring'

const TimerRing = dynamic(() => import('./timer-ring'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border-[3px] border-amber-400/60 border-t-amber-300 animate-spin" />
    </div>
  ),
})

const CYCLE: { phase: TimerPhase; durationMs: number; label: string }[] = [
  { phase: 'idle', durationMs: 2800, label: 'Idle · amber' },
  { phase: 'focus', durationMs: 6500, label: 'Focus · signal green' },
  { phase: 'break', durationMs: 3200, label: 'Break · violet' },
]

export function TimerRingCycling({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const prefersReduced = useReducedMotion()
  const current = CYCLE[index % CYCLE.length] ?? CYCLE[0]!

  useEffect(() => {
    if (prefersReduced) {
      setProgress(1)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / current.durationMs)
      setProgress(t)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setIndex((i) => i + 1)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [current.durationMs, prefersReduced])

  return (
    <div className={className}>
      <div className="relative w-full aspect-square">
        <TimerRing phase={current.phase} progress={progress} className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 text-center text-[10px] uppercase tracking-[0.22em] font-mono text-white/50">
          {current.label}
        </div>
      </div>
    </div>
  )
}
