'use client'

import dynamic from 'next/dynamic'
import type { SessionCard3DProps } from './session-card-3d'

const SessionCard3D = dynamic(() => import('./session-card-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1.1] rounded-3xl border border-white/10 bg-gradient-to-br from-[#14141f] to-[#1a1a28]" />
  ),
})

export function SessionCard3DLazy(props: SessionCard3DProps) {
  return <SessionCard3D {...props} />
}
