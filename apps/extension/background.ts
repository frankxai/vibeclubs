/**
 * Background service worker. Runs the AI witness ping, handles messaging from
 * content scripts, and proxies calls to vibeclubs.ai APIs (so the API key
 * never leaves the server).
 */

export {}

const RECAP_ENDPOINT = 'https://vibeclubs.ai/api/recap'
const SESSIONS_ENDPOINT = 'https://vibeclubs.ai/api/sessions'

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Vibeclubs] installed')
})

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'recap:event' || msg?.type === 'witness:event') {
    void fetch(RECAP_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(msg.event),
    })
      .then((r) => r.text())
      .then((text) => sendResponse({ ok: true, text }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }))
    return true // keep the message channel open for async response
  }

  if (msg?.type === 'session:log') {
    void fetch(SESSIONS_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(msg.session),
    })
      .then((r) => r.json())
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }))
    return true
  }

  return false
})
