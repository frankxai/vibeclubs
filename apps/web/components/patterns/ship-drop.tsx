'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui'

export type Drop = {
  id: string
  handle: string
  content: string
  kind: 'text' | 'link' | 'emoji' | 'screenshot'
  at: number
}

type ShipDropProps = {
  /** True when in the 60s ship phase. Controls overlay visibility. */
  active?: boolean
  /** Seconds remaining in the ship window. */
  secondsLeft?: number
  /** Crew handle of the current user, prefixes submitted drops. */
  handle?: string
  /** Existing drops from other the crew (most recent first). */
  drops?: Drop[]
  /** Called when the user submits a drop. */
  onDrop?: (content: string) => void
  className?: string
}

/**
 * The ship-moment overlay — 60 seconds at the end of a focus cycle where
 * the crew drop a one-liner / link / emoji / screenshot summary of
 * what they just shipped. This is vibe mechanic #3 — the rhythm of share.
 *
 * Purely a UI shell right now; the transport layer (broadcasting drops
 * across the crew via Supabase Realtime) lands in Sprint 2. Feed `drops`
 * prop with local-only state for now to preview the experience.
 */
export function ShipDrop({
  active = false,
  secondsLeft = 60,
  handle = '@you',
  drops = [],
  onDrop,
  className,
}: ShipDropProps) {
  const [value, setValue] = useState('')
  const [localDrops, setLocalDrops] = useState<Drop[]>([])

  useEffect(() => {
    if (!active) setValue('')
  }, [active])

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    const drop: Drop = {
      id: crypto.randomUUID(),
      handle,
      content: trimmed,
      kind: detectKind(trimmed),
      at: Date.now(),
    }
    setLocalDrops((d) => [drop, ...d])
    onDrop?.(trimmed)
    setValue('')
  }

  const allDrops = [...localDrops, ...drops]

  if (!active) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[80] flex items-end md:items-center justify-center p-4 md:p-10',
        'backdrop-blur-xl bg-black/60',
        className,
      )}
      role="dialog"
      aria-label="Ship moment"
    >
      <div className="relative w-full max-w-2xl rounded-[2rem] border border-amber-400/40 bg-gradient-to-br from-[#1a1025] via-[#0e0e16] to-[#0a0a0f] p-6 md:p-10 shadow-[0_40px_120px_-20px_rgba(245,158,11,0.3)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Badge tone="amber" dot size="xs">
              Ship moment
            </Badge>
            <span className="text-xs text-white/45 font-mono">crew is watching · 60s</span>
          </div>
          <div className="text-2xl font-bold tabular-nums text-amber-300">
            {String(Math.max(0, secondsLeft)).padStart(2, '0')}s
          </div>
        </div>

        <label className="block mb-4">
          <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-white/50 mb-3">
            Drop what you shipped
          </div>
          <div className="flex gap-2 items-stretch">
            <input
              type="text"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder="one line · a link · an emoji · 🔥 if you cooked"
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-base outline-none focus:border-amber-400/60 focus:bg-white/10 transition placeholder:text-white/30"
              maxLength={280}
            />
            <button
              onClick={submit}
              disabled={!value.trim()}
              className="rounded-xl bg-amber-400 text-black px-5 font-semibold disabled:opacity-40 disabled:pointer-events-none hover:bg-amber-300 transition"
            >
              Drop
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-white/35">
            <span>⏎ drops · esc dismisses · {value.length}/280</span>
          </div>
        </label>

        <div className="border-t border-white/5 pt-4 max-h-[40vh] overflow-y-auto">
          {allDrops.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">
              Drop something. The crew is waiting on you.
            </p>
          ) : (
            <ul className="space-y-2">
              {allDrops.map((drop) => (
                <li
                  key={drop.id}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5"
                >
                  <span className="text-[10px] font-mono text-amber-300 mt-0.5 shrink-0">
                    {drop.handle}
                  </span>
                  <span className="text-sm text-white/80 flex-1 break-words">{drop.content}</span>
                  <span className="text-[10px] font-mono text-white/30 shrink-0 mt-0.5">
                    {dropKindEmoji(drop.kind)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function detectKind(content: string): Drop['kind'] {
  if (/^https?:\/\//i.test(content)) return 'link'
  if (/^[\p{Emoji}\s]+$/u.test(content)) return 'emoji'
  if (/screenshot|img|png|jpg|webp/i.test(content)) return 'screenshot'
  return 'text'
}

function dropKindEmoji(kind: Drop['kind']): string {
  switch (kind) {
    case 'link':
      return '↗'
    case 'emoji':
      return '◉'
    case 'screenshot':
      return '▣'
    default:
      return '•'
  }
}
