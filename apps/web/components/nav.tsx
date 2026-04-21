'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LinkButton } from '@/components/ui'
import { cn } from '@/lib/cn'

const LINKS = [
  { href: '/explore', label: 'Find' },
  { href: '/extension', label: 'Extension' },
  { href: '/developers', label: 'Developers' },
  { href: '/playbook', label: 'How it works' },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold tracking-tight flex items-center gap-2.5">
          <span className="live-dot" />
          Vibeclubs
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'transition relative',
                  active ? 'text-white' : 'text-white/60 hover:text-white',
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-amber-400" />
                )}
              </Link>
            )
          })}
          <a
            href="https://github.com/frankxai/vibeclubs"
            target="_blank"
            rel="noreferrer noopener"
            className="text-white/60 hover:text-white transition"
          >
            GitHub ↗
          </a>
        </div>

        <LinkButton href="/start" variant="primary" size="sm">
          Host a vibeclub
        </LinkButton>
      </div>
    </nav>
  )
}
