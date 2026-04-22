'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

type MotionDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
> & {
  variants?: Variants
  initial?: string
  whileInView?: string
  viewport?: { once?: boolean; amount?: number }
  children?: React.ReactNode
}

const MotionDiv = motion.div as unknown as React.FC<MotionDivProps>

type StaggerProps = {
  gap?: number
  delay?: number
  once?: boolean
  amount?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Orchestrates a stagger on immediate children wrapped in `<StaggerItem>`.
 * Non-StaggerItem children render normally without stagger.
 */
export function Stagger({
  gap = 0.08,
  delay = 0,
  once = true,
  amount = 0.15,
  className,
  style,
  children,
}: StaggerProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children as React.ReactNode}
      </div>
    )
  }

  return (
    <MotionDiv
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </MotionDiv>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

type StaggerItemProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export function StaggerItem({ className, style, children }: StaggerItemProps) {
  return (
    <MotionDiv className={className} style={style} variants={itemVariants}>
      {children}
    </MotionDiv>
  )
}
