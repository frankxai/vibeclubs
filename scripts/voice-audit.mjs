#!/usr/bin/env node
/**
 * voice-audit.mjs
 *
 * Scans the repo for voice-system violations and exits non-zero if any are
 * found. Used both by `pnpm audit:voice` locally and the voice-audit GitHub
 * Action on every PR.
 *
 * The canonical voice rules live in VISION.md §"Voice — the five words" +
 * ADR-003-VOICE-SYSTEM.md + .claude/skills/voice/SKILL.md. This script is
 * the enforcement layer.
 *
 * Rules:
 *   - FORBIDDEN words trigger a violation unless the file is carved out
 *     (db schema, technical docs, third-party names).
 *   - Use --quiet to suppress the summary when nothing's wrong.
 *   - Use --json for machine-readable output (GitHub Action parses this).
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { argv, exit, cwd } from 'node:process'

const FORBIDDEN = [
  // Exact words that should never appear in consumer copy
  'community',
  'members',
  'rooms',
  'spaces',
  'engage',
  'connect',
  'unlock',
  'empower',
  'revolutionize',
  'disrupt',
  'anchor',
  'stamp',
  'field',
  'residency',
  'operator',
  'AI-powered',
]

// Phrases get matched as multi-word sequences; add here.
const FORBIDDEN_PHRASES = ['platform-powered', 'cloud tier']

// Files / globs to skip entirely. These are technical surfaces where the
// forbidden vocabulary is legitimate (db tables, lib internals, deps).
const SKIP_PATHS = [
  'pnpm-lock.yaml',
  'package-lock.json',
  // DB schema uses `users`, `community_id` etc as table/column names — DB terms
  'apps/web/lib/supabase',
  'supabase/migrations',
  // Legacy ADR-001 skeleton — preserved but not consumer-facing
  'apps/web/app/r',
  // Strategy / ADR / ops docs need these words to discuss the bans
  'VISION.md',
  'ADR-003-VOICE-SYSTEM.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'docs/strategy',
  'docs/ops',
  '.claude/skills/voice/SKILL.md',
  '.claude/commands/voice-audit.md',
  '.claude/commands/vibe-check.md',
  '.claude/agents',
  'HANDOVER-SUPERSEDED.md',
  'LAUNCH-KIT.md',
  // This script itself describes the forbidden list
  'scripts/voice-audit.mjs',
  // Stray files flagged for cleanup in HANDOVER-2026-04-21 — not consumer copy
  'arcanea-brain-3d.html',
  'ARCANEA-STUDIO-EVOLUTION.md',
  'atlas-data.json',
  'ops-sync-dashboard.jsx',
]

// File extensions to scan. Everything else is skipped.
const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mdx', '.md', '.html'])

// Markdown / MDX files are consumer-facing only for these roots. Everything else
// is dev-facing docs where "community" is fine.
const CONSUMER_MD_ROOTS = ['apps/web/content', 'content/clubs', 'README.md']

// Directory names that are always skipped at any depth in the tree.
const SKIP_DIR_SEGMENTS = new Set([
  'node_modules',
  '.next',
  '.turbo',
  '.git',
  'dist',
  'build',
  '.plasmo',
  '.output',
  'coverage',
])

function shouldSkip(path) {
  // Any path segment matching a skip-dir → out.
  const segments = path.split(/[/\\]/)
  for (const seg of segments) {
    if (SKIP_DIR_SEGMENTS.has(seg)) return true
  }
  for (const skip of SKIP_PATHS) {
    if (path === skip || path.startsWith(skip + '/') || path.startsWith(skip + '\\')) {
      return true
    }
  }
  return false
}

function isConsumerSurface(path) {
  // TS/TSX/JSX surfaces are always consumer-relevant unless in skipped libs.
  if (['.tsx', '.jsx'].includes(extname(path))) return true
  // HTML is consumer.
  if (extname(path) === '.html') return true
  // MD/MDX only counts for explicit consumer roots.
  if (['.md', '.mdx'].includes(extname(path))) {
    return CONSUMER_MD_ROOTS.some((root) => path === root || path.startsWith(root))
  }
  // TS files — only app/web sources, not libs/packages internals
  if (extname(path) === '.ts') {
    return path.startsWith('apps/web/app') || path.startsWith('apps/web/components')
  }
  return false
}

function walk(dir, root) {
  const results = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return results
  }
  for (const entry of entries) {
    const abs = join(dir, entry)
    const rel = relative(root, abs).replace(/\\/g, '/')
    if (shouldSkip(rel)) continue
    let s
    try {
      s = statSync(abs)
    } catch {
      continue
    }
    if (s.isDirectory()) {
      results.push(...walk(abs, root))
    } else if (SCAN_EXTS.has(extname(entry))) {
      results.push(rel)
    }
  }
  return results
}

const CONTEXT_DENIAL_KEYWORDS =
  /\b(veto(?:es)?|forbidden|banned|blacklist|denylist|not\s+accept(?:ing|ed)?|not\s+shipping|out\s+of\s+scope|rejected|don['’]?t\s+use|never\s+use)\b/i

/**
 * A forbidden word is "denied" if its line or the 3 lines above it use a
 * negation construction — "no breakout rooms", "not a community", "never
 * platform", "Vetoes — not shipping", "forbidden words". Denials are
 * legitimate meta-copy (the voice system defines itself by what it's NOT)
 * and pass the audit.
 */
function isDenial(line, word) {
  const patterns = [
    new RegExp(`\\bno\\s+(?:\\w+\\s+){0,3}${word}\\b`, 'i'),
    new RegExp(`\\bnot\\s+(?:a\\s+)?(?:\\w+\\s+){0,3}${word}\\b`, 'i'),
    new RegExp(`\\bnever\\s+(?:\\w+\\s+){0,3}${word}\\b`, 'i'),
    new RegExp(`\\bbanned\\s+(?:\\w+\\s+){0,3}${word}\\b`, 'i'),
    new RegExp(`\\banti-?${word}\\b`, 'i'),
    new RegExp(`\\breject(?:s|ed|ing)?\\s+(?:\\w+\\s+){0,3}${word}\\b`, 'i'),
    new RegExp(`\\bdon['’]?t\\s+(?:\\w+\\s+){0,3}${word}\\b`, 'i'),
    new RegExp(`\\bforbidden\\b[^.!?]*\\b${word}\\b`, 'i'),
    new RegExp(`\\bvetoes?\\b[^.!?]*\\b${word}\\b`, 'i'),
  ]
  return patterns.some((re) => re.test(line))
}

function isDeniedByContext(lines, index) {
  const from = Math.max(0, index - 4)
  for (let k = from; k < index; k++) {
    if (CONTEXT_DENIAL_KEYWORDS.test(lines[k])) return true
  }
  return false
}

function scanFile(path, root) {
  const violations = []
  if (!isConsumerSurface(path)) return violations
  let content
  try {
    content = readFileSync(join(root, path), 'utf8')
  } catch {
    return violations
  }
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Allow line-level escape hatch: `// voice-audit: allow` (or `<!-- ... -->`).
    if (/voice-audit:\s*allow/i.test(line)) continue
    for (const word of FORBIDDEN) {
      // Case-sensitive lowercase match with identifier-boundary lookaround —
      // `<Field>` (component), `vc-field` (CSS class), `field_1` (ident) all skipped.
      const regex = new RegExp('(?<![-\\w])' + word + '(?![\\w-])')
      if (regex.test(line) && !isDenial(line, word) && !isDeniedByContext(lines, i)) {
        violations.push({ path, line: i + 1, hit: word, text: line.trim().slice(0, 140) })
      }
    }
    for (const phrase of FORBIDDEN_PHRASES) {
      const regex = new RegExp('(?<![-\\w])' + phrase + '(?![\\w-])', 'i')
      if (
        regex.test(line) &&
        !isDenial(line, phrase.replace(/\s+/g, '\\s+')) &&
        !isDeniedByContext(lines, i)
      ) {
        violations.push({ path, line: i + 1, hit: phrase, text: line.trim().slice(0, 140) })
      }
    }
  }
  return violations
}

const args = argv.slice(2)
const asJson = args.includes('--json')
const quiet = args.includes('--quiet')

const root = cwd()
const files = walk(root, root)
const violations = []

for (const file of files) {
  violations.push(...scanFile(file, root))
}

if (asJson) {
  console.log(JSON.stringify({ count: violations.length, violations }, null, 2))
} else {
  if (violations.length === 0) {
    if (!quiet) console.log('✓ voice-audit passed — no forbidden vocabulary in consumer surfaces')
    exit(0)
  }
  console.error(`✗ voice-audit: ${violations.length} violation(s)\n`)
  console.error('| File | Line | Hit | Context |')
  console.error('|---|---|---|---|')
  for (const v of violations) {
    console.error(
      `| \`${v.path}\` | ${v.line} | \`${v.hit}\` | ${v.text.replace(/\|/g, '\\|')} |`,
    )
  }
  console.error('\nReference: VISION.md §Voice + .claude/skills/voice/SKILL.md')
  console.error('Rewrite using the five words: vibeclub / host / crew / lock in / ship')
}

exit(violations.length === 0 ? 0 : 1)
