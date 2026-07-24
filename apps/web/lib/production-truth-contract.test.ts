import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = path.resolve(import.meta.dirname, '../../..')
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
])
const skippedRootRelativeDirectories = new Set([
  '.git',
  '.next',
  '.plasmo',
  '.turbo',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'apps/extension/.plasmo',
  'apps/extension/.turbo',
  'apps/extension/build',
  'apps/extension/node_modules',
  'apps/web/.next',
  'apps/web/.turbo',
  'apps/web/node_modules',
  'packages/ai-witness/dist',
  'packages/ai-witness/node_modules',
  'packages/design-core/dist',
  'packages/design-core/node_modules',
  'packages/pomodoro-sync/dist',
  'packages/pomodoro-sync/node_modules',
  'packages/session-card/dist',
  'packages/session-card/node_modules',
  'packages/suno-bridge/dist',
  'packages/suno-bridge/node_modules',
  'packages/vibe-mix/dist',
  'packages/vibe-mix/node_modules',
])

function repositoryText(scanRoot = root): string {
  return walkRepository(scanRoot, scanRoot)
}

function walkRepository(directory: string, scanRoot: string): string {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .map((entry) => {
      const absolute = path.join(directory, entry.name)
      const relative = path.relative(scanRoot, absolute).split(path.sep).join('/')
      const stat = fs.lstatSync(absolute)

      if (stat.isSymbolicLink()) {
        throw new Error(`Production-truth scan refuses symbolic link: ${relative}`)
      }
      if (stat.isDirectory()) {
        if (skippedRootRelativeDirectories.has(relative)) return ''
        return walkRepository(absolute, scanRoot)
      }
      if (
        !textExtensions.has(path.extname(entry.name)) ||
        /\.test\.[^.]+$/.test(entry.name) ||
        entry.name === 'pnpm-lock.yaml'
      ) {
        return ''
      }
      const bytes = fs.readFileSync(absolute)
      if (bytes.includes(0)) return ''
      return bytes.toString('utf8')
    })
    .join('\n')
}

const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8')

describe('production truth contract', () => {
  it('treats exclusions as root-relative paths, not reusable directory names', () => {
    const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vibeclubs-truth-paths-'))
    try {
      fs.mkdirSync(path.join(fixtureRoot, 'node_modules'))
      fs.writeFileSync(path.join(fixtureRoot, 'node_modules', 'ignored.md'), 'root-only marker')
      fs.mkdirSync(path.join(fixtureRoot, 'docs', 'node_modules'), { recursive: true })
      fs.writeFileSync(
        path.join(fixtureRoot, 'docs', 'node_modules', 'scanned.md'),
        'nested marker',
      )

      const source = repositoryText(fixtureRoot)
      expect(source).not.toContain('root-only marker')
      expect(source).toContain('nested marker')
    } finally {
      fs.rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  it('fails closed on an in-root symbolic link', () => {
    const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vibeclubs-truth-link-'))
    try {
      fs.writeFileSync(path.join(fixtureRoot, 'target.md'), 'target')
      fs.symlinkSync('target.md', path.join(fixtureRoot, 'linked.md'))

      expect(() => repositoryText(fixtureRoot)).toThrow(/refuses symbolic link: linked\.md/)
    } finally {
      fs.rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })

  it('fails closed on a symbolic link that escapes the scan root', () => {
    const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vibeclubs-truth-root-'))
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vibeclubs-truth-outside-'))
    try {
      const outsideFile = path.join(outsideRoot, 'outside.md')
      fs.writeFileSync(outsideFile, 'outside')
      fs.symlinkSync(outsideFile, path.join(fixtureRoot, 'outside.md'))

      expect(() => repositoryText(fixtureRoot)).toThrow(/refuses symbolic link: outside\.md/)
    } finally {
      fs.rmSync(fixtureRoot, { recursive: true, force: true })
      fs.rmSync(outsideRoot, { recursive: true, force: true })
    }
  })

  it('recursively excludes known dead distribution and media targets', () => {
    const source = repositoryText()
    expect(source).not.toContain('chrome.google.com/webstore/detail/vibeclubs/placeholder')
    expect(source).not.toContain('discord.gg/vibeclubs')
    expect(source).not.toContain('cdn.vibeclubs.ai')
    expect(source).not.toContain('github.com/frankxai/vibeclubs/releases')
    expect(source).not.toContain('www.npmjs.com/package/@vibeclubs')
  })

  it('fails closed when the hosted account path is not configured', () => {
    const clubs = read('apps/web/app/api/clubs/route.ts')
    const sessions = read('apps/web/app/api/sessions/route.ts')
    const start = read('apps/web/app/start/page.tsx')
    const signin = read('apps/web/app/signin/page.tsx')

    for (const route of [clubs, sessions]) {
      expect(route).toContain('hasHostedConfig()')
      expect(route).toContain('hosted_not_configured')
      expect(route).toContain('status: 503')
    }
    expect(start).toContain('hostedReady ?')
    expect(signin).toContain('hostedReady ?')
  })

  it('routes club ownership through the database transaction', () => {
    const route = read('apps/web/app/api/clubs/route.ts')
    expect(route).toContain(".rpc('create_club_with_owner'")
    expect(route).not.toContain(".from('clubs')")
    expect(route).not.toContain(".from('club_members')")
  })

  it('validates extension Supabase settings before client creation', () => {
    const overlay = read('apps/extension/contents/overlay.tsx')
    const validator = overlay.indexOf('readExtensionSupabaseConfig({')
    const client = overlay.indexOf('createClient(')
    expect(validator).toBeGreaterThan(-1)
    expect(client).toBeGreaterThan(validator)
  })

  it('does not serve the superseded native room skeleton', () => {
    const room = read('apps/web/app/r/[room]/page.tsx')
    expect(room).toContain('notFound()')
    expect(room).toContain('index: false')
    expect(room).not.toMatch(/phase-4-placeholder|LiveKit room UI|Presence feed/)
  })

  it('includes source-backed public clubs in the sitemap', () => {
    const sitemap = read('apps/web/app/sitemap.ts')
    expect(sitemap).toContain('loadStaticClubs')
    expect(sitemap).toContain('staticClubRoutes')
    expect(sitemap).toContain('new Map')
  })

  it('labels extension and package distribution as development source', () => {
    const extension = read('apps/web/app/extension/page.tsx')
    const developers = read('apps/web/app/developers/page.tsx')
    const profile = read('apps/web/app/u/[handle]/page.tsx')

    expect(extension).toContain('not released yet')
    expect(extension).toContain('not published to npm yet')
    expect(developers).toContain('not published to npm yet')
    expect(profile).toContain('Read extension status')
    expect(profile).toContain('robots: { index: false, follow: false }')
  })
})
