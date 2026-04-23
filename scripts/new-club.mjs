#!/usr/bin/env node
/**
 * new-club.mjs
 *
 * Interactive CLI that scaffolds a new `content/clubs/<slug>.md` file. Prompts
 * for every required field, validates on the fly, writes the file. Run via
 * `pnpm new:club` or direct `node scripts/new-club.mjs`.
 *
 * Defaults are nudged toward the reference vibeclub shape — lofi / 50/10 /
 * discord — so a first-timer can accept defaults and still ship.
 */

import { writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { cwd, exit, stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline'

const rl = createInterface({ input: stdin, output: stdout })
const ask = (q, def) =>
  new Promise((resolve) => {
    rl.question(def ? `${q} \x1b[2m[${def}]\x1b[0m ` : `${q} `, (answer) => {
      const trimmed = answer.trim()
      resolve(trimmed || def || '')
    })
  })

const pick = async (q, options, def) => {
  const answer = await ask(`${q}\n  Options: ${options.join(' | ')}\n  →`, def)
  if (!options.includes(answer)) {
    console.log(`\x1b[31mInvalid "${answer}" — must be one of ${options.join(' | ')}\x1b[0m`)
    return pick(q, options, def)
  }
  return answer
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const clubsDir = join(cwd(), 'content', 'clubs')
  if (!existsSync(clubsDir)) {
    console.error(
      `\x1b[31mcontent/clubs/ not found at ${clubsDir}. Run from repo root.\x1b[0m`,
    )
    exit(1)
  }
  const existingSlugs = new Set(
    readdirSync(clubsDir)
      .filter((f) => f.endsWith('.md') && f !== 'README.md')
      .map((f) => f.replace(/\.md$/, '')),
  )

  console.log('\n\x1b[33m◇ new vibeclub scaffold\x1b[0m')
  console.log(
    '\x1b[2mAnswer a few prompts. Press enter to accept the [bracketed] default.\x1b[0m\n',
  )

  const name = await ask('Club name (Title Case)', 'Lofi Coders Global')
  let slug = await ask('Slug (used in URL)', slugify(name))
  slug = slugify(slug)
  while (existingSlugs.has(slug)) {
    console.log(`\x1b[31mSlug "${slug}" already exists. Pick another.\x1b[0m`)
    slug = slugify(await ask('Slug', slug + '-2'))
  }

  const host = await ask('Your handle (with @)', '@frankx')
  const platform = await pick(
    'Platform — where does the crew actually meet?',
    ['meet', 'discord', 'zoom', 'in_person', 'other'],
    'discord',
  )
  const type = await pick(
    'Type of vibeclub',
    ['coding', 'music', 'design', 'study', 'fitness', 'writing', 'other'],
    'coding',
  )
  const preset = await pick(
    'Pomodoro preset',
    [
      '25_5',
      '50_10',
      '90_20',
      'custom',
      'vibe_coding_sprint',
      'music_jam',
      'dance_break',
      'lightning',
    ],
    '50_10',
  )
  const ambient = await pick(
    'Ambient soundtrack',
    ['lofi', 'rain', 'cafe', 'nature', 'space'],
    'lofi',
  )
  const schedule = await ask('Schedule (include timezone)', 'Mondays 21:00 CET')
  const platformUrl = await ask('Platform URL (public invite, optional)', '')
  const location = await ask('Location (in-person / city-flavored, optional)', '')
  const featured = (await ask('Featured? (y/N)', 'N')).toLowerCase().startsWith('y')

  console.log('\n\x1b[33m◇ body\x1b[0m')
  console.log(
    '\x1b[2mWrite 1-3 short paragraphs describing the vibe. End with an empty line + Ctrl-D (or type END and enter).\x1b[0m',
  )

  const body = await new Promise((resolve) => {
    const buf = []
    rl.on('line', (line) => {
      if (line.trim().toUpperCase() === 'END') {
        rl.removeAllListeners('line')
        resolve(buf.join('\n').trim())
        return
      }
      buf.push(line)
    })
  })

  const fm = []
  fm.push('---')
  fm.push(`name: ${name}`)
  fm.push(`host: '${host}'`)
  fm.push(`platform: ${platform}`)
  fm.push(`type: ${type}`)
  fm.push(`preset: ${preset}`)
  fm.push(`ambient: ${ambient}`)
  fm.push(`schedule: '${schedule}'`)
  if (platformUrl) fm.push(`platform_url: '${platformUrl}'`)
  if (location) fm.push(`location: '${location}'`)
  if (featured) fm.push(`featured: true`)
  fm.push('---')
  fm.push('')
  fm.push(body || 'Write something here. What does this crew ship? What music? What rhythm?')
  fm.push('')

  const target = join(clubsDir, `${slug}.md`)
  writeFileSync(target, fm.join('\n'), 'utf8')

  console.log(`\n\x1b[32m✓ wrote ${target}\x1b[0m`)
  console.log(
    `\nNext steps:\n  1. Review the MD file.\n  2. \x1b[1mpnpm audit:clubs\x1b[0m — validate frontmatter.\n  3. \x1b[1mpnpm audit:voice\x1b[0m — check voice drift.\n  4. Commit + open a PR titled \x1b[1mclub: ${slug}\x1b[0m.\n`,
  )
  rl.close()
}

main().catch((err) => {
  console.error(err)
  exit(1)
})
