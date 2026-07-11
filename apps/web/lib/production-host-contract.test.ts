import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import config from '../next.config.mjs'

const root = path.resolve(import.meta.dirname, '../../..')
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8')

describe('production host contract', () => {
  it('publishes one absolute homepage canonical', () => {
    expect(read('apps/web/app/page.tsx')).toMatch(/canonical:\s*['"]https:\/\/vibeclubs\.ai\/['"]/)
  })

  it('redirects the www host to the apex without changing the path', async () => {
    const redirects = await config.redirects!()
    const redirect = redirects.find(
      (candidate) => candidate.destination === 'https://vibeclubs.ai/:path*',
    )

    expect(redirect).toBeDefined()
    expect(redirect?.has).toEqual([{ type: 'host', value: 'www.vibeclubs.ai' }])
    expect(redirect?.permanent).toBe(true)
  })

  it('sets the baseline browser security headers', async () => {
    const headerRoutes = await config.headers!()
    const headers = headerRoutes.find((route) => route.source === '/:path*')?.headers

    expect(headers).toContainEqual({ key: 'X-Content-Type-Options', value: 'nosniff' })
    expect(headers).toContainEqual({ key: 'X-Frame-Options', value: 'DENY' })
    expect(headers).toContainEqual({
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    })
    expect(headers).toContainEqual({
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=()',
    })
  })
})
