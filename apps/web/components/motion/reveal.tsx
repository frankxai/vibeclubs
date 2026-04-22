'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

const OFFSET = 24

const directionVariants: Record<Direction, Variants> = {
  up: { hidden: { opacity: 0, y: OFFSET }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -OFFSET }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: OFFSET }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -OFFSET }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

type RevealProps = {
  direction?: Direction
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function Reveal({
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className,
  style,
  children,
}: RevealProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children as React.ReactNode}
      </div>
    )
  }

  const MotionDiv = motion.div as unknown as React.FC<
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> & {
      variants?: Variants
      initial?: string
      whileInView?: string
      viewport?: { once?: boolean; amount?: number }
      transition?: { duration?: number; delay?: number; ease?: number[] }
      children?: React.ReactNode
    }
  >

  return (
    <MotionDiv
      className={className}
      style={style}
      variants={directionVariants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionDiv>
  )
}
