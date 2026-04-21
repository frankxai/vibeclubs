# @vibeclubs/vibe-mix

Three-layer Web Audio mixer. Ambient + music + voice/page. Framework-agnostic.

```ts
import { createMixer } from '@vibeclubs/vibe-mix'

const mixer = createMixer({ ambientBaseUrl: '/ambient' })
await mixer.loadAmbient('lofi')
mixer.setLevel('ambient', 0.4)
mixer.setLevel('music', 0.25)
await mixer.playMusic('https://cdn.vibeclubs.ai/suno/track-123.mp3')

// Duck the ambient when someone starts speaking
mixer.duckAmbient(-6, 300)
```

## Layers

| Layer | Purpose | Typical level |
|---|---|---|
| `ambient` | Shared loops (lofi, rain, café). Seamless loop. | 0.3–0.4 |
| `music` | Per-listener track. One at a time. Crossfade on swap. | 0.2–0.3 |
| `page` | Tab audio / WebRTC voice. Host wires into `mixer.pageGain`. | 0.7–0.9 |

## License

MIT.
