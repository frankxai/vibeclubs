# Chrome Extension — Developer Guide

For install + user docs, see the landing page at [/extension](https://vibeclubs.ai/extension).

## Dev loop

```bash
pnpm install
pnpm dev:extension
```

Plasmo produces `apps/extension/build/chrome-mv3-dev`. Load it unpacked:

1. `chrome://extensions` → Developer Mode
2. "Load unpacked" → `apps/extension/build/chrome-mv3-dev`
3. Pin the icon
4. Click → set club slug

Hot reload works for content scripts and popup.

## File map

```
apps/extension/
├── popup.tsx              ← 320px popup; set active club
├── contents/
│   ├── overlay.tsx        ← content-script UI injected on every page
│   └── overlay.css        ← scoped styles (injected via Plasmo getStyle)
├── background.ts          ← service worker; API proxy
├── assets/icon.png        ← replace before shipping
└── package.json           ← manifest fields live under "manifest"
```

## Why Plasmo

- React in content scripts with zero setup
- Manifest V3 out of the box
- Hot reload
- TypeScript-first
- Handles the build/package round-trip for Chrome Web Store

## Packages consumed

| Package | What it does |
|---|---|
| `@vibeclubs/vibe-mix` | Three-layer Web Audio mixer |
| `@vibeclubs/pomodoro-sync` | Pomodoro state + Supabase Realtime broadcast |
| `@vibeclubs/ai-witness` | Prompt builder for Claude witness events |
| `@vibeclubs/session-card` | SVG session card generator |
| `@vibeclubs/suno-bridge` | Suno API wrapper with royalty-free fallback |

All five are workspace packages — edits flow through with no `pnpm build` step thanks to the `"main": "./src/index.ts"` entries.

## The AudioContext gesture rule

Web Audio APIs require a user gesture before `AudioContext` can start making sound. The overlay boots the mixer on the first `onClick`. This is why the overlay feels "asleep" until you click once.

## Publishing

```bash
pnpm --filter @vibeclubs/extension build
pnpm --filter @vibeclubs/extension package
```

Upload `build/chrome-mv3-prod.zip` to the Chrome Web Store Developer Console. Review typically takes 1–3 days. Frank's $5 developer fee + listing tasks live in [../ENVIRONMENT.md](../ENVIRONMENT.md) §5.
