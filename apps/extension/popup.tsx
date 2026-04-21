import { useEffect, useState } from 'react'

/**
 * Popup — minimal club selector. The overlay content-script does the real
 * work. Popup is where you tell the extension "I'm in club X."
 */
export default function Popup() {
  const [clubSlug, setClubSlug] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    chrome.storage.local.get('clubSlug', (data) => {
      setClubSlug(typeof data.clubSlug === 'string' ? data.clubSlug : '')
      setLoaded(true)
    })
  }, [])

  function save() {
    void chrome.storage.local.set({ clubSlug })
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div
      style={{
        width: 320,
        padding: 22,
        background: '#0a0a0f',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 13,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#f59e0b',
            display: 'inline-block',
            animation: 'vc-pop-pulse 2.2s infinite',
          }}
        />
        <strong style={{ fontSize: 14 }}>Vibeclubs</strong>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          v0.1
        </span>
      </div>

      <label
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        Active club slug
      </label>
      <input
        value={clubSlug}
        onChange={(e) => setClubSlug(e.target.value)}
        placeholder="lofi-coders"
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
          color: 'white',
          marginTop: 8,
          marginBottom: 16,
          outline: 'none',
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={save}
        disabled={!loaded}
        style={{
          width: '100%',
          padding: 11,
          borderRadius: 999,
          background: saved ? '#4FD18C' : '#f59e0b',
          color: 'black',
          border: 'none',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {saved ? 'saved ✓' : 'save'}
      </button>

      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'grid',
          gap: 6,
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        <div>
          <kbd style={kbdStyle}>⌘</kbd>
          <kbd style={kbdStyle}>J</kbd> show / hide overlay
        </div>
        <div>
          <kbd style={kbdStyle}>⌘</kbd>
          <kbd style={kbdStyle}>K</kbd> start / pause pomodoro
        </div>
        <div>
          <kbd style={kbdStyle}>⌘</kbd>
          <kbd style={kbdStyle}>⇧</kbd>
          <kbd style={kbdStyle}>M</kbd> mute all
        </div>
      </div>

      <a
        href="https://vibeclubs.ai/explore"
        target="_blank"
        rel="noreferrer noopener"
        style={{
          display: 'block',
          marginTop: 14,
          fontSize: 11,
          color: '#fcd34d',
          textAlign: 'center',
          textDecoration: 'none',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        find a vibeclub →
      </a>

      <style>{`
        @keyframes vc-pop-pulse {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.5 }
        }
        kbd {
          display: inline-block;
          padding: 1px 4px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          margin: 0 1px;
        }
      `}</style>
    </div>
  )
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '1px 4px',
  borderRadius: 4,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.04)',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 10,
  margin: '0 1px',
  color: 'rgba(255,255,255,0.6)',
}
