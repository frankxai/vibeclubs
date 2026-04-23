'use client'

import dynamic from 'next/dynamic'

const DevelopersNetwork = dynamic(() => import('./developers-network'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e0e16] to-[#0a0a0f]" />
  ),
})

export function DevelopersNetworkLazy({ className }: { className?: string }) {
  return <DevelopersNetwork className={className} />
}
