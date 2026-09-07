import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const plugin = resolve(root, 'plugins/vibeclubs')
const read = (path: string) => readFileSync(resolve(root, path), 'utf8')

describe('skill-first host pack', () => {
  it('ships a skill-only manifest with a resolvable skill', () => {
    const manifest = JSON.parse(readFileSync(resolve(plugin, '.codex-plugin/plugin.json'), 'utf8'))
    expect(manifest.name).toBe('vibeclubs')
    expect(manifest.mcpServers).toBeUndefined()
    expect(manifest.apps).toBeUndefined()
    expect(existsSync(resolve(plugin, manifest.skills, 'host-a-vibeclub/SKILL.md'))).toBe(true)
    for (const prompt of manifest.interface.defaultPrompt) {
      expect(prompt.length).toBeLessThanOrEqual(128)
    }
  })

  it('keeps every default ritual contiguous and exactly its advertised duration', () => {
    const rituals = read('plugins/vibeclubs/skills/host-a-vibeclub/references/rituals.md')
    const rows = rituals.split('\n').filter((line) => /^\| (60|90|120) \|/.test(line))
    expect(rows).toHaveLength(3)
    for (const row of rows) {
      const cells = row
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean)
      const duration = Number(cells.shift())
      let previousEnd = 0
      for (const cell of cells) {
        const [start = NaN, end = NaN] = cell.split('–').map(Number)
        expect(start).toBe(previousEnd)
        expect(end).toBeGreaterThan(start)
        previousEnd = end
      }
      expect(previousEnd).toBe(duration)
    }
  })

  it('resolves the skill reference and public discovery route', () => {
    const skill = read('plugins/vibeclubs/skills/host-a-vibeclub/SKILL.md')
    const links = [...skill.matchAll(/\]\((references\/[^)]+)\)/g)]
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(existsSync(resolve(plugin, 'skills/host-a-vibeclub', link[1]!))).toBe(true)
    }
    expect(read('apps/web/public/llms.txt')).toContain('https://vibeclubs.ai/host-pack.txt')
    expect(read('apps/web/public/host-pack.txt').length).toBeGreaterThan(500)
  })
})
