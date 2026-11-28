export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'

const AGENTS_MD = `# Vibeclubs — Agent Surface Guide (AX)

> Brand: **Vibeclubs** (\`${SITE}\`)
> License: MIT open format & software (\`https://github.com/frankxai/vibeclubs\`)
> Summary: Lock in with your crew. Ship the thing. Playbook, club directory, Chrome extension, and local-first ritual format.

## Canonical discovery endpoints

- [\`/llms.txt\`](${SITE}/llms.txt) — Machine-readable directory of core routes, playbook entries, and active clubs.
- [\`/.well-known/agent.json\`](${SITE}/.well-known/agent.json) — Structured discovery descriptor (\`starlight.agent.v1\`).
- [\`/sitemap.xml\`](${SITE}/sitemap.xml) — Complete public sitemap.

## Core human & agent surfaces

- [\`/\`](${SITE}/) — Lock-in crew format overview and live ritual timer entry.
- [\`/explore\`](${SITE}/explore) — Public directory of clubs and session formats.
- [\`/start\`](${SITE}/start) — Start or host a Vibeclub session.
- [\`/playbook\`](${SITE}/playbook) — Open format rules: name, join, focus, ship, recap.
- [\`/extension\`](${SITE}/extension) — Chrome timer & crew recap extension source and install guide.
- [\`/developers\`](${SITE}/developers) — Architecture, hosted config boundaries, and self-hosting notes.

## Boundaries & honesty rules

1. **Format over coercion:** Vibeclubs documents an open MIT format for focused group build sessions; there are no fabricated community size claims or guaranteed shipping outcomes.
2. **Scoped persistence:** Browser-only sessions keep state local to the browser; hosted club persistence operates only when explicit Supabase configuration is enabled.
3. **Open source:** Source, playbook, and extension code are published under MIT at \`https://github.com/frankxai/vibeclubs\`.
`

export function GET() {
  return new Response(AGENTS_MD, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
