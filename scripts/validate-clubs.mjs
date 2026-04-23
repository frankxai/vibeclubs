#!/usr/bin/env node
/**
 * validate-clubs.mjs
 *
 * Validates every `content/clubs/*.md` file:
 *   - Frontmatter is well-formed.
 *   - Required fields present and in the allowed enum.
 *   - Body is at least 60 chars (one sentence minimum).
 *   - Slug (filename) matches [a-z0-9-]+ pattern.
 *
 * Exits 0 on success, 1 on any violation. Used by the club-validate
 * GitHub Action on every PR and by `pnpm audit:clubs` locally.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { cwd, exit, argv } from 'node:process'

const PLATFORMS = ['meet', 'discord', 'zoom', 'in_person', 'other']
const TYPES = ['coding', 'music', 'design', 'study', 'fitness', 'writing', 'other']
const PRESETS = [
  '25_5',
  '50_10',
  '90_20',
  'custom',
  'vibe_coding_sprint',
  'music_jam',
  'dance_break',
  'lightning',
]
const AMBIENTS = ['lofi', 'rain', 'cafe', 'nature', 'space']
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/

const root = cwd()
const clubsDir = join(root, 'content', 'clubs')
const args = argv.slice(2)
const asJson = args.includes('--json')

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return null
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return null
  const fm = raw.slice(4, end)
  const body = raw.slice(end + 5).trim()
  const data = {}
  for (const line of fm.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }
    if (value === 'true') data[key] = true
    else if (value === 'false') data[key] = false
    else data[key] = value
  }
  return { data, body }
}

function validate(slug, parsed) {
  const errors = []
  if (!parsed) {
    errors.push('Missing or malformed YAML frontmatter (expected ---\\n...\\n---\\n at top of file)')
    return errors
  }
  const { data, body } = parsed

  if (!SLUG_RE.test(slug)) {
    errors.push(
      `Slug "${slug}" must match [a-z0-9][a-z0-9-]*[a-z0-9]. Rename the file to e.g. "${slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/^-+|-+$/g, '')}.md"`,
    )
  }

  const required = ['name', 'host', 'platform', 'type', 'preset', 'ambient', 'schedule']
  for (const key of required) {
    if (!data[key] || (typeof data[key] === 'string' && data[key].trim() === '')) {
      errors.push(`Missing required frontmatter field: "${key}"`)
    }
  }

  if (data.host && !String(data.host).startsWith('@')) {
    errors.push(`"host" must start with @ (e.g. "@frankx"). Got: "${data.host}"`)
  }
  if (data.platform && !PLATFORMS.includes(String(data.platform))) {
    errors.push(`"platform" must be one of ${PLATFORMS.join(' | ')}. Got: "${data.platform}"`)
  }
  if (data.type && !TYPES.includes(String(data.type))) {
    errors.push(`"type" must be one of ${TYPES.join(' | ')}. Got: "${data.type}"`)
  }
  if (data.preset && !PRESETS.includes(String(data.preset))) {
    errors.push(`"preset" must be one of ${PRESETS.join(' | ')}. Got: "${data.preset}"`)
  }
  if (data.ambient && !AMBIENTS.includes(String(data.ambient))) {
    errors.push(`"ambient" must be one of ${AMBIENTS.join(' | ')}. Got: "${data.ambient}"`)
  }
  if (data.platform_url && !/^https?:\/\//.test(String(data.platform_url))) {
    errors.push(`"platform_url" must be an http(s) URL. Got: "${data.platform_url}"`)
  }
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push(`"featured" must be true or false. Got: "${data.featured}"`)
  }
  if (!body || body.length < 60) {
    errors.push(
      `Body too short (${body?.length ?? 0} chars). Minimum 60 — one sentence at least about the vibe.`,
    )
  }
  return errors
}

let files = []
try {
  files = readdirSync(clubsDir).filter((f) => f.endsWith('.md') && f !== 'README.md')
} catch (err) {
  console.error(`✗ validate-clubs: cannot read ${clubsDir}: ${err.message}`)
  exit(1)
}

const allErrors = []
for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  const abs = join(clubsDir, file)
  let raw
  try {
    raw = readFileSync(abs, 'utf8')
  } catch {
    allErrors.push({ file, errors: [`Cannot read file: ${abs}`] })
    continue
  }
  const parsed = parseFrontmatter(raw)
  const errors = validate(slug, parsed)
  if (errors.length) allErrors.push({ file, errors })
}

if (asJson) {
  console.log(JSON.stringify({ checked: files.length, failed: allErrors.length, details: allErrors }, null, 2))
} else {
  if (allErrors.length === 0) {
    console.log(`✓ validate-clubs: all ${files.length} clubs valid`)
    exit(0)
  }
  console.error(`✗ validate-clubs: ${allErrors.length} of ${files.length} club(s) failed\n`)
  for (const fileErrors of allErrors) {
    console.error(`\x1b[31m${fileErrors.file}\x1b[0m`)
    for (const err of fileErrors.errors) {
      console.error(`  • ${err}`)
    }
    console.error()
  }
  console.error(
    'Reference: content/clubs/README.md — frontmatter schema + PR-based listing contract.',
  )
}

exit(allErrors.length === 0 ? 0 : 1)
