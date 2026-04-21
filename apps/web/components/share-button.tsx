'use client'

import { useState } from 'react'
import { Button, toast } from '@/components/ui'
import { cn } from '@/lib/cn'

interface ShareButtonProps {
  clubName: string
  clubUrl: string
  schedule?: string | null
}

export function ShareButton({ clubName, clubUrl, schedule }: ShareButtonProps) {
  const [open, setOpen] = useState(false)

  const when = schedule?.toLowerCase() || 'tonight'
  const name = clubName.toLowerCase()

  const variants = [
    `hosting a vibeclub ${when} — ${name}. drop in ↓\n${clubUrl}`,
    `${name} vibeclub. claude code + lofi + crew. ${when}.\n${clubUrl}`,
    `lock in with us ${when}. ${name}. bring what you're shipping.\n${clubUrl}`,
  ]

  function copy(text: string) {
    void navigator.clipboard.writeText(text)
    toast.success('copied — paste anywhere', { duration: 1600 })
  }

  if (!open) {
    return (
      <Button variant="outline" size="md" onClick={() => setOpen(true)}>
        Share →
      </Button>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 max-w-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-amber-300 font-mono">
          share it
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-white/40 hover:text-white text-sm"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Pick the one that sounds like you. Paste it anywhere — X, Discord, iMessage.
      </p>
      <div className="space-y-2">
        {variants.map((t, i) => (
          <button
            key={i}
            onClick={() => copy(t)}
            className={cn(
              'w-full text-left rounded-2xl border border-white/10 bg-white/[0.02]',
              'hover:border-amber-400/40 hover:bg-white/[0.04] transition p-4',
              'focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none',
            )}
          >
            <div className="font-mono text-[11px] text-white/40 mb-1.5">
              variant {i + 1} · click to copy
            </div>
            <div className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed">{t}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(variants[0]!)}`}
          target="_blank"
          rel="noreferrer noopener"
          className="flex-1 px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-center text-sm transition"
        >
          Post on X →
        </a>
        <a
          href={`https://discord.com/channels/@me`}
          target="_blank"
          rel="noreferrer noopener"
          className="flex-1 px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-center text-sm transition"
        >
          Open Discord →
        </a>
      </div>
    </div>
  )
}
