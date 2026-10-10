# Music factory handoff

The Suno bridge preserves per-listener music and bring-your-own assets. It no
longer calls a guessed Suno endpoint or reads an ambient API key. Legacy options
remain accepted for source compatibility but do not trigger a network request.

A `generationAdapter` and nonempty `authorizedJobRef` are required for generated
music. The host owns owner authentication, finite budget reservation, durable job
idempotency, provider selection, archive/provenance and rights checks. The job ref
is a handoff to that host, not self-authenticating authorization inside this library.

Adapter failure propagates for reconciliation; it never silently falls back or
blindly retries a paid operation. Explicit fallback URLs are caller-supplied HTTPS
assets, not independently verified music or rights. Adapter assets carry an
`adapter_reported_asset` evidence label. No provider account is deployed here.

Public craft and production contract: https://github.com/frankxai/agentic-music-producer-os/tree/18dc9bee02001befb3a2a3bd7747b78f798dff13. The text MCP workbench adds preparation only:
https://github.com/frankxai/suno-mcp-server/tree/2ad81c4414e19a1f3e7b6546db1796d68f2c8865.

Targeted bridge tests and TypeScript validation do not stand in for the full
workspace format/lint/typecheck/build gates. Keep this integration draft until
those run in a complete checkout. No consumer UI or club listing is changed.
