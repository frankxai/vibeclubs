# Extension permissions review

Reviewed 2026-09-02 against the code in this directory. Every permission the
manifest requests has to name the call site that needs it. A permission with no
call site is removed, not justified — Chrome shows each one to the user at
install, and an unused `tabCapture` reads as "this extension records you".

Source of truth: the `manifest` block in `apps/extension/package.json` (Plasmo
generates `manifest.json` from it at build time).

## Current requests

| Request | Verdict | Why |
| --- | --- | --- |
| `permissions: storage` | Keep | `chrome.storage.local` holds the session snapshot (`lib/session/store.ts`), the club slug and the recap consent choice. Local only; nothing syncs. |
| `host_permissions: https://vibeclubs.ai/*` | Keep | The service worker (`background.ts`) POSTs to `https://vibeclubs.ai/api/recap` and `/api/sessions`. A cross-origin fetch from the worker needs the host listed. Narrowed from `https://*/*` + `http://*/*` on 2026-09-02. |
| `content_scripts.matches: https://*/*, http://*/*` | Keep, with a caveat | The overlay is the product: a session has to run on whatever call, doc or stream the crew already uses. Declared on the content script, which does not grant fetch rights to those origins. **Caveat:** this is still the widest thing we ask for and it is what a Chrome Web Store reviewer will question. If the crew-observed set of hosts stays small (Meet, Discord, Zoom, YouTube), narrow it before store submission. |

## Removed 2026-09-02

| Removed | Reason |
| --- | --- |
| `tabCapture` | Never called. No file in `apps/` or `packages/` references `chrome.tabCapture`. The mixer's page layer is a `GainNode` the host page wires up (`packages/vibe-mix`), not a tab capture. Requesting it implied the extension could record the tab, which it cannot and must not. |
| `activeTab` | Never called. The overlay reaches pages through `content_scripts.matches`; no code calls `chrome.scripting` or reads tab contents on click. |
| `host_permissions: https://*/*, http://*/*` | Over-broad. The only cross-origin fetch in the extension goes to `vibeclubs.ai`. |

## Standing rules

1. Recording stays out. There is no permission in this manifest that can capture
   audio, video or screen pixels, and `Session.v1` has no field that would turn
   one on. Any future recap feature is opt-in per participant and disclosed in
   the overlay before it can be enabled (`Consent`, `lib/session/schema.ts`).
2. Data that leaves the browser is limited to what the recap disclosure names:
   a club identifier, a timer event and a cycle count. No page content, audio,
   video, chat or pixels. The invite link carries no personal data at all and
   the encoder throws rather than emit one that does (`lib/session/invite.ts`).
3. Adding a permission requires adding a row here in the same commit, naming the
   file and function that calls it.
