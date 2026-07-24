import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '../../..')
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8')

function readRuntimeSources(directory: string): string {
  const absolute = path.join(root, directory)
  return fs
    .readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => !['node_modules', '.next', '.plasmo', 'build', 'dist'].includes(entry.name))
    .map((entry) => {
      const relative = path.join(directory, entry.name)
      if (entry.isDirectory()) return readRuntimeSources(relative)
      if (!/\.(?:ts|tsx|js|jsx)$/.test(entry.name) || /\.test\.[^.]+$/.test(entry.name)) return ''
      return read(relative)
    })
    .join('\n')
}

describe('hosted participant privacy contract', () => {
  it('shows a participant notice before AI recap can be enabled', () => {
    const overlay = read('apps/extension/contents/overlay.tsx')
    expect(overlay).toContain('Before Claude writes a recap')
    expect(overlay).toContain('recapNoticeAccepted: false')
    expect(overlay).toContain('disabled={!settings.recapNoticeAccepted}')
    expect(overlay).toContain('canRequestAiRecap(settingsRef.current)')
    expect(overlay).toContain('if (!settingsLoaded) return')
  })

  it('does not install telemetry or send sensitive content fields to analytics', () => {
    const runtime = [readRuntimeSources('apps'), readRuntimeSources('packages')].join('\n')
    const manifests = [
      read('package.json'),
      read('apps/web/package.json'),
      read('apps/extension/package.json'),
    ].join('\n')

    expect(manifests).not.toMatch(/@vercel\/analytics|posthog|plausible|segment/i)
    expect(runtime).not.toMatch(/analytics\.(?:track|capture)|posthog\.capture|sendBeacon/i)
    expect(read('apps/extension/contents/overlay.tsx')).not.toMatch(
      /type:\s*'recap:event'[\s\S]{0,280}(?:club_name|participant_handle|clubName|shipped|recap:)/i,
    )
  })

  it('ties retention and deletion copy to the current database behavior', () => {
    const privacy = read('apps/web/app/privacy/page.tsx')
    const schema = read('supabase/migrations/20260419000000_init.sql')

    expect(privacy).toMatch(/no automatic expiry/i)
    expect(privacy).toMatch(/no self-service\s+delete\s+control/i)
    expect(privacy).toContain('mailto:open@vibeclubs.ai')
    expect(privacy).not.toMatch(/within seven days|account holder deletes it/i)
    expect(schema).toMatch(
      /user_id uuid not null references public\.users\(id\) on delete cascade/i,
    )
    expect(schema).not.toMatch(/sessions_delete_self/i)
  })

  it('preserves the local host, join, focus, ship, and recap proof', () => {
    const proof = read('apps/web/components/ritual-proof.tsx')
    expect(proof).toContain("['host', 'join', 'focus', 'ship', 'recap']")
    expect(proof).toContain('Create local invite →')
    expect(proof).toContain('Start 6-second focus →')
    expect(proof).toContain('Create local recap →')
    expect(proof).toContain('Download SVG card')
  })
})
