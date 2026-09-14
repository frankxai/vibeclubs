import { useEffect, useState } from 'react'
import {
  TEMPLATES,
  createSession,
  decodeInvite,
  inviteUrl,
  joinSession,
  loadSnapshot,
  saveSnapshot,
  templateById,
  tokenFromUrl,
  type SessionSnapshot,
} from './lib/session'

/**
 * Popup — where a session begins. Hosting produces an invite link that carries
 * the ritual and the shared start time and nothing about anyone; joining is
 * pasting that link back. Neither path touches a server.
 */
export default function Popup() {
  const [clubSlug, setClubSlug] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState(false)

  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null)
  const [templateId, setTemplateId] = useState(TEMPLATES[0]?.id ?? '25_5')
  const [startsInMin, setStartsInMin] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [inviteInput, setInviteInput] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    chrome.storage.local.get('clubSlug', (data) => {
      setClubSlug(typeof data.clubSlug === 'string' ? data.clubSlug : '')
      setLoaded(true)
    })
    void loadSnapshot().then(setSnapshot)
  }, [])

  async function host() {
    const next = createSession({
      templateId,
      startEpochMs: Date.now() + startsInMin * 60_000,
      hostDisplayName: displayName.trim() || 'Host',
    })
    await saveSnapshot(next)
    setSnapshot(next)
    const url = inviteUrl('https://vibeclubs.ai', next.session)
    try {
      await navigator.clipboard.writeText(url)
      setNote('Invite copied. Send it to your crew.')
    } catch {
      setNote(url)
    }
  }

  async function join() {
    const token = tokenFromUrl(inviteInput) ?? inviteInput
    const result = decodeInvite(token)
    if (!result.ok || !result.session) {
      setNote(result.errors[0] ?? 'That invite could not be read.')
      return
    }
    const next = joinSession(result.session, displayName.trim() || 'You')
    await saveSnapshot(next)
    setSnapshot(next)
    setInviteInput('')
    setNote(`Joined. ${templateById(next.session.templateId)?.label ?? 'Ritual'} starts on the shared clock.`)
  }

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

      <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
        <span style={labelStyle}>Session</span>

        {snapshot ? (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            {templateById(snapshot.session.templateId)?.label ?? snapshot.session.templateId}
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              Starts {new Date(snapshot.session.startEpochMs).toLocaleTimeString()} · everyone
              computes the same clock from the invite.
            </div>
            <button
              onClick={() => {
                void navigator.clipboard
                  .writeText(inviteUrl('https://vibeclubs.ai', snapshot.session))
                  .then(() => setNote('Invite copied.'))
                  .catch(() => setNote('Clipboard blocked here.'))
              }}
              style={{ ...ghostButtonStyle, marginTop: 8 }}
            >
              Copy invite
            </button>
          </div>
        ) : (
          <>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              style={inputStyle}
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name, for your screen only"
              style={inputStyle}
            />
            <select
              value={startsInMin}
              onChange={(e) => setStartsInMin(Number(e.target.value))}
              style={inputStyle}
            >
              <option value={0}>Start now</option>
              <option value={5}>Start in 5 minutes</option>
              <option value={15}>Start in 15 minutes</option>
            </select>
            <button onClick={() => void host()} style={primaryButtonStyle}>
              Host and copy invite
            </button>
            <input
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              placeholder="or paste an invite link"
              style={inputStyle}
            />
            <button onClick={() => void join()} style={ghostButtonStyle}>
              Join
            </button>
          </>
        )}
        {note && (
          <p style={{ fontSize: 11, color: '#fcd34d', margin: 0, wordBreak: 'break-all' }}>{note}</p>
        )}
      </div>

      <label style={labelStyle}>Active club slug</label>
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

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  color: 'white',
  fontSize: 12,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 999,
  background: '#f59e0b',
  color: 'black',
  border: 'none',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
}

const ghostButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: 9,
  borderRadius: 999,
  background: 'transparent',
  color: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(255,255,255,0.14)',
  fontSize: 12,
  fontFamily: 'inherit',
  cursor: 'pointer',
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
