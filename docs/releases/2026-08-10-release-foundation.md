# Release foundation receipt — 2026-08-10

## Scope

Build a truthful changelog and release contract for Vibeclubs without creating a
tag, publishing a GitHub release, publishing npm packages, or deploying production.

## Audited truth

- Repository: `frankxai/vibeclubs`
- Default branch: `main`
- Audited head: `417dc5185e7175e365323483808bf38032f2abaa`
- History represented: 24 commits, 2026-04-21 through 2026-07-24
- Existing tags before this change: none
- Existing GitHub releases before this change: none
- `CHANGELOG.md` entry `0.1.0` is historical documentation, not proof of a tag
  or published release.
- Merged proof receipts: PRs 3, 4, and 5

## Production proof

Vercel project `vibeclubs-web` reported deployment
`dpl_27f4GhPvQfomwoPE3gcUUPXU583u` as ready at the audited head. The live
homepage, robots file, and sitemap were verified on 2026-08-10. The public
`/changelog` route returned the application 404 and remains recorded as missing.

## Controls added

- Machine-readable release ledger tied to an immutable commit.
- Validator that fails on changelog, source, production, or workflow drift.
- Manual-only GitHub draft-release workflow with exact-main and exact-SHA checks.
- Tag-triggered npm workflow changed to validation and dry-run only.
- Real npm publishing now requires a manual non-dry run, repository variable,
  protected GitHub environment, separate ledger approval, and OIDC provenance.
- GitHub-generated notes grouped into product, reliability, community, and
  maintenance categories.

## Human-gated next actions

1. Merge the release-foundation PR after checks pass.
2. Re-audit `main`, set the ledger candidate SHA, validation, and human approval.
3. Configure required reviewers for `github-release-draft` before running the
   release workflow.
4. Publish the draft release only after a human reviews the generated notes.
5. Configure npm trusted publishers and `npm-production` reviewers separately;
   do not couple repository releases to package publication.
6. Add a public changelog route only as a separate visual, accessibility, SEO,
   and performance-reviewed change.
