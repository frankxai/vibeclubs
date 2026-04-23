---
description: Dispatch the club-curator agent on a PR or on uncommitted content/clubs/ changes. Produces an approve/request-changes verdict.
---

Review a proposed vibeclub listing for schema + voice + veto compliance before merge.

## Input

One of:

- A PR number (`/curate 42`) — fetches the PR diff, identifies changed `content/clubs/*.md` files
- A slug (`/curate lofi-coders-amsterdam`) — reviews the existing MD file at `content/clubs/<slug>.md`
- No argument — reviews every uncommitted `content/clubs/*.md` in the working tree

## What runs

Dispatch the `club-curator` agent (see `.claude/agents/club-curator.md`) with the target file(s). The agent:

1. Runs `pnpm audit:clubs` — frontmatter schema
2. Runs `pnpm audit:voice` — voice system
3. Reads the body against the veto list
4. Reads the body against the voice system (five words, no capital-noun ceremony)
5. Checks specificity ("Lofi coders Amsterdam" passes, "General tech club" fails)
6. Checks host handle, platform link, preset sanity

## Output

A verdict table per the club-curator's canonical shape:

```markdown
## Club curator verdict — <slug>

**Schema** ✅ / ❌
**Voice** ✅ / ❌
**Vetoes** ✅ / ❌
**Specificity:** <verdict + reason>

### Proposed rewrites
| Line | Issue | Proposed rewrite |
|---|---|---|

### Verdict
<approve | request changes | hard reject>
```

## When to use

- Reviewing a PR from a contributor
- Self-reviewing before pushing your own club
- Before a batch of clubs is added to `/explore` (e.g., cohort seed batch)

## References

- `.claude/agents/club-curator.md` — full agent spec
- `content/clubs/README.md` — frontmatter schema + PR contract
- `CONTRIBUTING.md §What We're Not Accepting` — the vetoes
