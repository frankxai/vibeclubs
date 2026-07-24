import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const appOutput = path.join(repositoryRoot, 'apps/web/.next/server/app')
const staticOutput = path.join(repositoryRoot, 'apps/web/.next/static')

const requiredArtifacts = [
  'api/clubs/route.js',
  'api/sessions/route.js',
  'auth/callback/route.js',
  'club/[slug]/page.js',
  'developers.html',
  'extension.html',
  'privacy.html',
  'r/[room]/page.js',
  'signin.html',
  'sitemap.xml/route.js',
  'sitemap.xml/route.js.nft.json',
  'start.html',
  'terms.html',
  'u/[handle]/page.js',
]

const forbiddenTargets = [
  ['chrome.google.com', '/webstore/detail/vibeclubs/placeholder'].join(''),
  ['discord.gg', '/vibeclubs'].join(''),
  ['cdn.', 'vibeclubs.ai'].join(''),
  ['github.com/frankxai/vibeclubs', '/releases'].join(''),
  ['www.npmjs.com/package', '/@vibeclubs'].join(''),
  ['phase-4', '-placeholder'].join(''),
]

if (!fs.existsSync(appOutput) || !fs.existsSync(staticOutput)) {
  fail('Next production output is missing. Run `pnpm build` before this audit.')
}

for (const relative of requiredArtifacts) {
  if (!fs.existsSync(path.join(appOutput, relative))) {
    fail(`Required production artifact is missing: apps/web/.next/server/app/${relative}`)
  }
}

const emittedText = [readTree(appOutput), readTree(staticOutput)].join('\n')
for (const target of forbiddenTargets) {
  if (emittedText.includes(target)) fail(`Forbidden target reached production output: ${target}`)
}

const extensionHtml = fs.readFileSync(path.join(appOutput, 'extension.html'), 'utf8')
const developersHtml = fs.readFileSync(path.join(appOutput, 'developers.html'), 'utf8')
const sitemapTrace = JSON.parse(
  fs.readFileSync(path.join(appOutput, 'sitemap.xml/route.js.nft.json'), 'utf8'),
)

if (!extensionHtml.includes('not released yet')) {
  fail('Built extension route is missing its release-boundary copy.')
}
if (!developersHtml.includes('not published to npm yet')) {
  fail('Built developers route is missing its registry-boundary copy.')
}
for (const slug of [
  'lofi-coders-amsterdam',
  'morning-writers-global',
  'vibe-coding-sprint-thursdays',
  'founder-deepwork-tuesdays',
  'suno-producers-global',
]) {
  if (
    !sitemapTrace.files.some((file) =>
      file.replaceAll('\\', '/').endsWith(`/content/clubs/${slug}.md`),
    )
  ) {
    fail(`Built sitemap trace is missing public club source: ${slug}`)
  }
}

console.log(
  `✓ built-truth audit passed — ${requiredArtifacts.length} route artifacts and 5 public clubs verified`,
)

function readTree(directory) {
  return fs
    .readdirSync(directory)
    .map((name) => {
      const absolute = path.join(directory, name)
      const relative = path.relative(repositoryRoot, absolute)
      const stat = fs.lstatSync(absolute)
      if (stat.isSymbolicLink()) fail(`Production output contains a symbolic link: ${relative}`)
      if (stat.isDirectory()) return readTree(absolute)
      const bytes = fs.readFileSync(absolute)
      return bytes.includes(0) ? '' : bytes.toString('utf8')
    })
    .join('\n')
}

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}
