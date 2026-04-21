import cssText from 'data-text:./overlay.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PlasmoCSConfig, PlasmoGetStyle } from 'plasmo'
import { createMixer, type Layer, type Mixer } from '@vibeclubs/vibe-mix'
import { createPomodoro, type Pomodoro, type PomodoroState } from '@vibeclubs/pomodoro-sync'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*', 'http://*/*'],
  run_at: 'document_idle',
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

type View = 'timer' | 'mix' | 'settings'

interface Settings {
  ambientPreset: string
  duckOnVoice: boolean
  recapEnabled: boolean
}

const DEFAULT_SETTINGS: Settings = {
  ambientPreset: 'lofi',
  duckOnVoice: true,
  recapEnabled: true,
}

export default function VibeOverlay() {
  const [clubSlug, setClubSlug] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [view, setView] = useState<View>('timer')
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  const [mixer, setMixer] = useState<Mixer | null>(null)
  const [pomo, setPomo] = useState<Pomodoro | null>(null)
  const [timerMs, setTimerMs] = useState(0)
  const [state, setState] = useState<PomodoroState | null>(null)
  const [recap, setRecap] = useState<string>('')

  // Load config from extension storage
  useEffect(() => {
    chrome.storage.local.get(['clubSlug', 'settings'], (data) => {
      if (typeof data.clubSlug === 'string' && data.clubSlug) setClubSlug(data.clubSlug)
      if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...(data.settings as Settings) })
    })
  }, [])

  // Persist settings
  useEffect(() => {
    void chrome.storage.local.set({ settings })
  }, [settings])

  // Keyboard shortcuts (⌘K / ⌘J / ⌘⇧M)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!e.metaKey && !e.ctrlKey) return
      if (e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setCollapsed((c) => !c)
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (!pomo) return
        if (state?.phase === 'idle' || !state) pomo.start()
        else pomo.pause()
      } else if (e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        mixer?.setLevel('ambient', 0)
        mixer?.setLevel('music', 0)
        mixer?.setLevel('page', 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mixer, pomo, state])

  // Boot audio + timer on first user interaction (AudioContext requires gesture)
  const booted = useRef(false)
  function boot() {
    if (booted.current || !clubSlug) return
    booted.current = true
    const m = createMixer({
      ambientBaseUrl: 'https://cdn.vibeclubs.ai/ambient',
      duckOnVoice: settings.duckOnVoice,
    })
    void m.loadAmbient(settings.ambientPreset).catch(() => undefined)
    setMixer(m)
    const p = createPomodoro({ clubId: clubSlug, preset: '25_5' })
    p.on<number>('tick', (remainingMs) => setTimerMs(remainingMs))
    p.on('phase', () => setState(p.state()))
    p.on<number>('complete', async (cycle) => {
      if (!settings.recapEnabled) return
      const resp = await chrome.runtime
        .sendMessage({
          type: 'recap:event',
          event: {
            type: 'pomodoro_complete',
            club_id: clubSlug,
            cycle_number: cycle,
          },
        })
        .catch(() => null)
      if (resp?.text) setRecap(resp.text)
    })
    setPomo(p)
  }

  useEffect(
    () => () => {
      mixer?.dispose()
      pomo?.dispose()
    },
    [mixer, pomo],
  )

  const mmss = useMemo(() => formatTime(timerMs), [timerMs])

  if (!clubSlug) {
    return (
      <div className="vc-overlay vc-unconfigured">
        <div className="live-dot" />
        <span>
          Pick a club in the Vibeclubs popup <kbd>⌘J</kbd> to hide
        </span>
      </div>
    )
  }

  if (collapsed) {
    return (
      <button className="vc-overlay vc-collapsed" onClick={() => setCollapsed(false)}>
        <span className="live-dot" />
        <span className="vc-col-time">{mmss || '--:--'}</span>
        <span className="vc-col-slug">#{clubSlug}</span>
      </button>
    )
  }

  return (
    <div className="vc-overlay" onClick={boot}>
      <header className="vc-header">
        <div className="live-dot" />
        <span className="vc-club">#{clubSlug}</span>
        <div className="vc-controls-mini">
          <button
            aria-label="Collapse"
            onClick={(e) => {
              e.stopPropagation()
              setCollapsed(true)
            }}
          >
            —
          </button>
        </div>
      </header>

      <nav className="vc-tabs">
        <button className={view === 'timer' ? 'active' : ''} onClick={() => setView('timer')}>
          Timer
        </button>
        <button className={view === 'mix' ? 'active' : ''} onClick={() => setView('mix')}>
          Mixer
        </button>
        <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>
          Settings
        </button>
      </nav>

      {view === 'timer' && (
        <section className="vc-section">
          <div className={`vc-timer vc-timer-${state?.phase ?? 'idle'}`}>{mmss || '25:00'}</div>
          <div className="vc-phase">
            {state?.phase ?? 'idle'} {state && <span className="vc-cycle">· cycle {state.cycle + 1}</span>}
          </div>
          <div className="vc-primary-controls">
            <button onClick={() => pomo?.start()}>Start</button>
            <button onClick={() => pomo?.pause()}>Pause</button>
            <button onClick={() => pomo?.reset()}>End</button>
          </div>
          {recap && (
            <div className="vc-recap">
              <div className="vc-recap-label">Recap</div>
              <div className="vc-recap-text">{recap}</div>
            </div>
          )}
        </section>
      )}

      {view === 'mix' && (
        <section className="vc-section">
          <MixFader label="Ambient" layer="ambient" mixer={mixer} defaultValue={0.3} />
          <MixFader label="Music" layer="music" mixer={mixer} defaultValue={0.25} />
          <MixFader label="Page" layer="page" mixer={mixer} defaultValue={0.85} />
          <div className="vc-hint">
            <kbd>⌘⇧M</kbd> mute all · <kbd>⌘K</kbd> start / pause
          </div>
        </section>
      )}

      {view === 'settings' && (
        <section className="vc-section">
          <label className="vc-field">
            <span>Ambient preset</span>
            <select
              value={settings.ambientPreset}
              onChange={(e) => setSettings((s) => ({ ...s, ambientPreset: e.target.value }))}
            >
              <option value="lofi">Lo-fi</option>
              <option value="rain">Rain</option>
              <option value="cafe">Café</option>
              <option value="nature">Nature</option>
              <option value="space">Space</option>
            </select>
          </label>
          <label className="vc-toggle">
            <input
              type="checkbox"
              checked={settings.duckOnVoice}
              onChange={(e) => setSettings((s) => ({ ...s, duckOnVoice: e.target.checked }))}
            />
            <span>Duck ambient when someone speaks</span>
          </label>
          <label className="vc-toggle">
            <input
              type="checkbox"
              checked={settings.recapEnabled}
              onChange={(e) => setSettings((s) => ({ ...s, recapEnabled: e.target.checked }))}
            />
            <span>AI recap at session end</span>
          </label>
          <a
            href={`https://vibeclubs.ai/club/${clubSlug}`}
            target="_blank"
            rel="noreferrer noopener"
            className="vc-link"
          >
            Open club page ↗
          </a>
        </section>
      )}
    </div>
  )
}

function MixFader({
  label,
  layer,
  mixer,
  defaultValue,
}: {
  label: string
  layer: Layer
  mixer: Mixer | null
  defaultValue: number
}) {
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    mixer?.setLevel(layer, value)
  }, [mixer, layer, value])
  return (
    <div className="vc-fader">
      <span className="vc-fader-label">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => setValue(Number(e.target.value) / 100)}
      />
      <span className="vc-fader-value">{Math.round(value * 100)}</span>
    </div>
  )
}

function formatTime(ms: number): string {
  if (ms <= 0) return ''
  const total = Math.floor(ms / 1000)
  const mm = Math.floor(total / 60)
  const ss = total % 60
  return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`
}
