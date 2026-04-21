import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vibeclubs',
    short_name: 'Vibeclubs',
    description:
      'Claude Code + your crew + a soundtrack. Host a vibeclub.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#0a0a0f',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
