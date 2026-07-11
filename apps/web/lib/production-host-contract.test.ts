import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '../../..')
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8')

describe('production host contract', () => {
  it('publishes one absolute homepage canonical', () => {
    expect(read('apps/web/app/page.tsx')).toContain(
      "alternates: { canonical: 'https://vibeclubs.ai/' }",
    )
  })

  it('redirects the www host to the apex without changing the path', () => {
    const config = read('apps/web/next.config.mjs')
    expect(config).toContain("has: [{ type: 'host', value: 'www.vibeclubs.ai' }]")
    expect(config).toContain("destination: 'https://vibeclubs.ai/:path*'")
    expect(config).toContain('permanent: true')
  })

  it('sets the baseline browser security headers', () => {
    const config = read('apps/web/next.config.mjs')
    expect(config).toContain("{ key: 'X-Content-Type-Options', value: 'nosniff' }")
    expect(config).toContain("{ key: 'X-Frame-Options', value: 'DENY' }")
    expect(config).toContain("{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }")
    expect(config).toContain("value: 'camera=(), microphone=(), geolocation=()'")
  })
})
