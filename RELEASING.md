# Releasing Vibeclubs

Vibeclubs separates public trust updates, repository releases, package releases,
and production deployments. One does not silently authorize another.

## Current truth

- `CHANGELOG.md` is the public change history.
- `docs/releases/release-ledger.json` is the machine-readable release state.
- `docs/releases/v0.2.0.md` is a draft candidate, not a published release.
- The documented `0.1.0` milestone has no corresponding Git tag or GitHub release.
- The public site has no `/changelog` route yet.

## Meaningful-update rhythm

Update `CHANGELOG.md` when a user, contributor, operator, privacy boundary, or
production truth materially changes. Batch small internal chores into the next
meaningful entry. Keep weekly internal receipts if useful, but do not manufacture a
public announcement merely because a calendar week ended.

Every candidate must name immutable proof: commit SHA, merged PRs, deployment
state, validation results, and known gaps. Claims about future or hosted features
stay explicitly labeled until they are visible in production.

## GitHub release path

1. Update `CHANGELOG.md`, the release notes, and the release ledger.
2. Run `pnpm audit:release` plus the normal repository gates.
3. Merge the candidate to `main` and record the new exact main SHA.
4. Set `release.status` to `ready`, `validationComplete` to `true`, and
   `humanReleaseApproval` to `true` in a reviewed change.
5. Configure required reviewers on the `github-release-draft` environment.
6. Manually run **Draft GitHub release** from `main` with the exact version and SHA.
7. Review the draft on GitHub. Publishing the draft remains a human action.

The workflow refuses a non-main run, a stale SHA, a tag at another commit, an
unapproved ledger, or a version mismatch. Safe retries may reuse the exact tag or
draft. It creates an annotated tag and a draft release; it never publishes the
release.

## npm package path

Tags only validate, build, and dry-run the six packages. They cannot publish.
Package publication is a separate manual action and requires all of the following:

- `packagePublishing.status` set to `ready`;
- `humanPackageApproval` set to `true`;
- workflow input `dry-run=false`;
- repository variable `ENABLE_NPM_PUBLISH=true`;
- approval through the `npm-production` environment;
- npm trusted publishers bound to this repository, workflow filename, and
  environment.

The publish job uses GitHub OIDC and npm provenance rather than a long-lived npm
token. Configure and test trusted publishing before changing the ledger to ready.
If package contents or versions differ, publish them as their own reviewed batch.

## Production and public changelog

GitHub releases do not deploy the website. Vercel production follows the existing
Git integration and must be verified independently. Before any push intended to
build a preview or production deployment, check that the project has no recent
in-flight deployment.

A future `/changelog` page should consume curated repository release data and add
useful internal links and structured metadata. It must go through the repository's
design, responsive, accessibility, performance, and visual QA gates before it is
claimed as live.

## References

- [GitHub generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes)
- [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
