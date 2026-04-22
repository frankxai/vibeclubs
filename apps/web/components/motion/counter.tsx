'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type CounterProps = {
  to: number
  from?: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

export function Counter({
  to,
  from = 0,
  duration = 1.4,
  format = (n) => Math.round(n).toLocaleString(),
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const prefersReduced = useReducedMotion()
  const [value, setValue] = useState(prefersReduced ? to : from)

  useEffect(() => {
    if (!inView || prefersReduced) return
    const start = performance.now()
    const delta = to - from
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(from + delta * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, from, to, duration, prefersReduced])

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
