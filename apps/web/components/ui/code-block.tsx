'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'

interface CodeBlockProps {
  code: string
  lang?: string
  className?: string
  caption?: string
}

export function CodeBlock({ code, lang = 'bash', className, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function copy() {
    void navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
          {caption ?? lang}
        </div>
        <button
          onClick={copy}
          className="text-[11px] font-mono text-white/50 hover:text-amber-300 transition"
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
      </div>
      <pre className="p-4 text-sm leading-relaxed overflow-auto">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
