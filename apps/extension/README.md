# @vibeclubs/extension

Chrome extension source (Plasmo / Manifest V3) for the Vibeclubs overlay. No Chrome Web Store build or GitHub release is public yet.

The local timer works without hosted settings. Realtime sync requires a build with the public Supabase settings. Ambient playback requires a verified audio base URL. Saved profile history is not wired in the current extension.

## Develop

```bash
pnpm install
pnpm --filter=@vibeclubs/extension dev
```

Plasmo will spin up a hot-reloading unpacked extension at `apps/extension/build/chrome-mv3-dev`.

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked" → choose `apps/extension/build/chrome-mv3-dev`
4. Pin the extension, click the icon, set a club slug (e.g. `lofi-coders`)
5. Open Google Meet / Discord / YouTube — the overlay appears bottom-right

Optional build settings:

```bash
PLASMO_PUBLIC_SUPABASE_URL=
PLASMO_PUBLIC_SUPABASE_ANON_KEY=
PLASMO_PUBLIC_AMBIENT_BASE_URL=
```

## Build for the Chrome Web Store

```bash
pnpm --filter=@vibeclubs/extension build
pnpm --filter=@vibeclubs/extension package
```

Output: `build/chrome-mv3-prod.zip`. Publishing it still requires owner review, a final icon, and Chrome Web Store approval.

## Icon

`assets/icon.png` is a placeholder. Replace with a 512×512 transparent PNG before shipping. Plasmo auto-generates all required sizes.

## Permissions

- `storage` — persist the selected club slug + user settings
- `activeTab` — inject overlay into the current tab only
- `tabCapture` — future: capture tab audio into the mixer's page layer
- `host_permissions: <all_urls>` — overlay must run on any site

## Architecture

- `popup.tsx` — small popup: set the active club slug
- `contents/overlay.tsx` — the actual overlay UI, injected via Plasmo content script
- `background.ts` — service worker; proxies witness + session-log API calls
- Packages consumed: `@vibeclubs/vibe-mix`, `@vibeclubs/pomodoro-sync`, `@vibeclubs/ai-witness`, `@vibeclubs/session-card`, `@vibeclubs/suno-bridge`

## Privacy model

The extension never reads page content. It only:
- Reads/writes its own `chrome.storage.local` values (club slug, user prefs)
- Streams ambient audio only when the build supplies a verified audio base URL
- Broadcasts timer state only when the build supplies the public Supabase settings
- POSTs recap events to `vibeclubs.ai/api/recap` after disclosure and opt-in
