'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SparkOrb } from '@/components/patterns/spark-orb'

const VibeOrb = dynamic(() => import('./vibe-orb'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full aspect-square">
      <SparkOrb size={420} hue="dual" className="inset-0 m-auto" />
    </div>
  ),
})

type Fader = {
  key: 'ambient' | 'music' | 'voice'
  label: string
  accent: string
  hue: string
  desc: string
}

const FADERS: Fader[] = [
  {
    key: 'ambient',
    label: 'Ambient',
    accent: 'amber',
    hue: '#fcd34d',
    desc: 'Royalty-free looped pads. Lofi, rain, café, nature, space.',
  },
  {
    key: 'music',
    label: 'Music',
    accent: 'violet',
    hue: '#8b5cf6',
    desc: 'Per-listener AI generation via Suno. DMCA-safe by construction.',
  },
  {
    key: 'voice',
    label: 'Voice',
    accent: 'signal',
    hue: '#4fd18c',
    desc: 'Your tab audio — Meet, Discord, YouTube. Ducks the mix when you speak.',
  },
]

export function VibeOrbDemo({ className }: { className?: string }) {
  const [values, setValues] = useState({ ambient: 0.45, music: 0.65, voice: 0.3 })
  const prefersReduced = useReducedMotion()

  return (
    <div className={cn('grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center', className)}>
      <div className="relative">
        <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0e0e16] via-[#120d1d] to-[#0a0a0f] aspect-square overflow-hidden">
          {prefersReduced ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <SparkOrb size={420} hue="dual" className="relative" />
            </div>
          ) : (
            <VibeOrb
              ambient={values.ambient}
              music={values.music}
              voice={values.voice}
              className="absolute inset-0"
            />
          )}
          <div className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[0.22em] font-mono text-white/35">
            the mix · live
          </div>
          <div className="absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono text-white/45">
            <span className="live-dot" />
            <span>3 layers</span>
          </div>
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-white/40 mb-3">
            Drag the faders
          </div>
          <p className="text-lg text-white/70 leading-relaxed max-w-md">
            This is the extension, visualized. Every fader drives a shader uniform.
            The same three layers power your actual session — ambient, music, voice — in each
            listener&apos;s ears, never broadcast.
          </p>
        </div>

        <div className="space-y-5">
          {FADERS.map((f) => (
            <InteractiveFader
              key={f.key}
              fader={f}
              value={values[f.key]}
              onChange={(next) => setValues((prev) => ({ ...prev, [f.key]: next }))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type InteractiveFaderProps = {
  fader: Fader
  value: number
  onChange: (v: number) => void
}

function InteractiveFader({ fader, value, onChange }: InteractiveFaderProps) {
  return (
    <label className="block group cursor-pointer">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-3">
          <span className="font-semibold text-[15px]">{fader.label}</span>
          <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-white/35">
            {Math.round(value * 100)}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="vc-fader-range w-full"
        style={{
          // biome-ignore lint: CSS var
          ['--fill' as string]: `${Math.round(value * 100)}%`,
          ['--accent' as string]: fader.hue,
        }}
        aria-label={`${fader.label} level`}
      />
      <p className="text-xs text-white/45 mt-2 leading-relaxed max-w-sm">{fader.desc}</p>
    </label>
  )
}
