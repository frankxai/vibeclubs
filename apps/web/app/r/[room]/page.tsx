/**
 * LEGACY — ADR-001 skeleton, preserved for a hypothetical Phase 4 (native rooms).
 *
 * ADR-002 supersedes this path: the current product is the Chrome extension
 * overlay on existing platforms (Meet/Discord/Zoom). This file is kept so the
 * architecture is documented in code and the route remains a reference for
 * Phase 4 resurrection if demand proves.
 *
 * Do NOT extend this. New room-like UX belongs in apps/extension.
 */

import { notFound } from 'next/navigation'

interface Params {
  params: Promise<{ room: string }>
}

export default async function RoomPage({ params }: Params) {
  const { room } = await params

  if (!room || room.length < 2) notFound()

  // Phase 4 placeholder: LiveKit access token generation was removed with the
  // livekit-server-sdk dependency. If you're reviving this path, reinstall
  // livekit-server-sdk and restore the AccessToken logic.
  const token = 'phase-4-placeholder'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-lg font-semibold">#{room}</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <button>Pomodoro</button>
          <button>Vibe Mix</button>
          <button>Witness</button>
          <button>Leave</button>
        </nav>
      </header>
      <main className="grid grid-cols-[1fr_320px] h-[calc(100vh-4rem)]">
        <section className="p-6">
          {/* TODO: <LiveKitRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} /> */}
          <div className="h-full rounded-3xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40">
            LiveKit room UI goes here (token: {token.slice(0, 20)}...)
          </div>
        </section>
        <aside className="border-l border-white/5 p-6 flex flex-col gap-6">
          <Panel title="Who's here">
            <div className="text-sm text-white/50">Presence feed will render here</div>
          </Panel>
          <Panel title="Pomodoro">
            <div className="text-4xl font-mono">25:00</div>
            <div className="text-xs text-white/40 mt-2">Sync via Supabase Realtime</div>
          </Panel>
          <Panel title="Vibe mix">
            <div className="space-y-2 text-xs text-white/60">
              <MixSlider label="Ambient" />
              <MixSlider label="Music" />
              <MixSlider label="Voice" />
            </div>
          </Panel>
        </aside>
      </main>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-xs uppercase tracking-wider text-white/40 mb-2">{title}</div>
      {children}
    </div>
  )
}

function MixSlider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16">{label}</span>
      <input type="range" min={0} max={100} defaultValue={30} className="flex-1" />
    </div>
  )
}
