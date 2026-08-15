import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')
const fail = (message) => {
  throw new Error(`release contract: ${message}`)
}

const ledger = JSON.parse(read('docs/releases/release-ledger.json'))
const changelog = read('CHANGELOG.md')
const packageWorkflow = read('.github/workflows/release-packages.yml')
const githubWorkflow = read('.github/workflows/draft-github-release.yml')
const releaseNotes = read(`docs/releases/${ledger.release.tag}.md`)

if (ledger.schemaVersion !== 1) fail('schemaVersion must be 1')
if (ledger.repository !== 'frankxai/vibeclubs') fail('repository must be frankxai/vibeclubs')
if (ledger.defaultBranch !== 'main') fail('defaultBranch must be main')

const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/
if (!semver.test(ledger.release.version)) fail('release.version must be SemVer')
if (ledger.release.tag !== `v${ledger.release.version}`)
  fail('release.tag must match release.version')
if (!['draft', 'ready', 'published'].includes(ledger.release.status)) {
  fail('release.status must be draft, ready, or published')
}
if (!/^[0-9a-f]{40}$/.test(ledger.source.auditedHead)) fail('source.auditedHead must be a full SHA')
if (ledger.release.targetSha !== ledger.source.auditedHead)
  fail('release.targetSha must equal source.auditedHead')
if (!Number.isInteger(ledger.source.commitCount) || ledger.source.commitCount < 1) {
  fail('source.commitCount must be a positive integer')
}
if (ledger.receipts.pullRequests.length !== 3) fail('exactly three merged PR receipts are expected')
if (!changelog.includes(`Release candidate: \`${ledger.release.tag}\``)) {
  fail('CHANGELOG.md must identify the draft candidate')
}
if (!releaseNotes.includes(ledger.source.auditedHead))
  fail('release notes must name the audited SHA')
if (ledger.production.deploymentSha !== ledger.source.auditedHead) {
  fail('production deployment SHA must match the audited source')
}
if (ledger.production.changelogRoute.status !== 'missing-404') {
  fail('public changelog route must remain explicitly recorded as missing-404')
}

const packageGuards = [
  "github.event_name == 'workflow_dispatch'",
  'inputs.dry-run == false',
  "vars.ENABLE_NPM_PUBLISH == 'true'",
  'environment: npm-production',
  '--provenance',
]
for (const guard of packageGuards) {
  if (!packageWorkflow.includes(guard)) fail(`package workflow is missing guard: ${guard}`)
}
if (!packageWorkflow.includes('publish --dry-run')) fail('tag path must retain a dry-run publish')
if (!githubWorkflow.includes('workflow_dispatch:'))
  fail('GitHub release workflow must be manual-only')
if (/^ {2}(push|release|schedule):/m.test(githubWorkflow)) {
  fail('GitHub release workflow may not have an automatic trigger')
}
if (!githubWorkflow.includes('environment: github-release-draft')) {
  fail('GitHub release workflow must use its protected environment')
}
if (!githubWorkflow.includes('--draft')) fail('GitHub release workflow may only create a draft')

try {
  execFileSync('git', ['cat-file', '-e', `${ledger.source.auditedHead}^{commit}`], {
    cwd: root,
    stdio: 'ignore',
  })
  execFileSync('git', ['merge-base', '--is-ancestor', ledger.source.auditedHead, 'HEAD'], {
    cwd: root,
    stdio: 'ignore',
  })
} catch {
  fail('audited source must exist and be an ancestor of HEAD')
}

const mode = process.env.RELEASE_MODE ?? 'validate'
if (mode === 'github-release-draft') {
  if (ledger.release.status !== 'ready') fail('GitHub release requires release.status=ready')
  if (!ledger.approvals.humanReleaseApproval) fail('GitHub release requires human approval')
  if (!ledger.approvals.validationComplete) fail('GitHub release requires completed validation')
  if (process.env.RELEASE_VERSION !== ledger.release.version)
    fail('workflow version must match ledger')
  if (process.env.RELEASE_TARGET_SHA !== ledger.release.targetSha)
    fail('workflow SHA must match ledger')
}
if (mode === 'package-publish') {
  if (ledger.packagePublishing.status !== 'ready') fail('npm publishing is not marked ready')
  if (!ledger.approvals.humanPackageApproval)
    fail('npm publishing requires separate human approval')
}

process.stdout.write(
  `release contract ok: ${ledger.release.tag} ${ledger.release.status} at ${ledger.source.auditedHead}\n`,
)
