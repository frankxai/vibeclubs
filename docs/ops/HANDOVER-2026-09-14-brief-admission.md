# Brief admission hardening — 2026-09-14

The optional build-brief endpoint previously awaited `request.text()` without an upload deadline. A stalled or oversized body could consume server time before authentication, quota admission, or the bounded model call.

`readBrief` now enforces an 8 KiB streamed byte limit, a five-second whole-body deadline, disconnect cancellation, and strict UTF-8/JSON decoding. Rejections return recoverable 400, 408, or 413 responses. Stream cancellation is best effort and cannot prolong the deadline. Existing activation, authentication, atomic daily quota, model selection, structured output, and local host-pack workflow remain in effect.

Validation performed locally:

- Reader, route, and host-pack suites: 51 passing tests.
- Web TypeScript, lint, and production build: passed; 26 routes generated.
- Ten reader tests cover split multibyte input, exact/oversized bodies, invalid JSON and UTF-8, stalled upload, disconnect, pre-aborted requests, and transport failure.

No provider calls or production deployments were made. Production AI activation still requires the configuration and migration checks in the existing studio roadmap. This change affects request admission only; authenticated model generation and quota behavior retain their existing tests.
