# Community Needs Research 2026

Status: working research synthesis for Starlight Communities and Vibeclubs.

## Verdict

The market does not need another generic community platform. It needs a
sovereign coordination layer that works where people already gather, turns
participation into proof, and lets agents help without becoming invisible
authorities.

For Vibeclubs, that means:

1. Web2 is the adoption layer: Discord, Slack, GitHub, Meet, Zoom, YouTube, and
   creator channels.
2. Web3 is the ownership and verification layer: wallets, token or NFT access,
   governance, portable proof, and social graph adapters.
3. Web4 is the bounded-agent layer: AI agents with identities, scoped tools,
   review gates, logs, and user-controlled data movement.

## What People Actually Need

### Web2 Communities

Needs:

- smaller, more authentic spaces rather than noisy growth-at-all-costs feeds,
- workflows that remove admin work without forcing a tool migration,
- proof that something happened, shipped, or changed,
- integrations with the chat/work surfaces where the group already lives,
- easy onboarding for non-technical hosts.

Evidence:

- Circle's 2026 report frames the shift as connection over attention and
  emphasizes intentional, human, audience-specific community design.
- Deloitte's 2026 digital media study shows fan behavior is fragmented across
  many networks, with creator and community recommendations materially shaping
  entertainment behavior.
- Discord Activities are web apps embedded inside Discord, matching the
  Vibeclubs "work where the crew already is" thesis.
- Slack Workflow Builder shows the mainstream direction: AI-assisted workflows,
  connectors, conditional branches, and non-technical automation.

Build implication:

Vibeclubs should prioritize Discord Activity, GitHub proof, Slack workflow, and
web fallback paths before asking people to adopt a new destination.

### Web3 Communities

Needs:

- read-only verification before write or custody,
- clear proof of membership, contribution, and reputation,
- governance that is legible and safe,
- treasury or token-gated workflows that do not feel like scam funnels,
- optional protocol bridges rather than forced wallet-first onboarding.

Evidence:

- Snapshot remains a core DAO voting primitive because it gives flexible,
  gasless, offchain governance spaces, proposals, and voting strategies.
- Guild connects community access across EVM chains and platforms including
  Discord, Telegram, Twitter, and GitHub.
- Collab.Land focuses on token verification, repeated re-verification, and
  security education around trusted bots, read-only access, and scam reporting.
- Farcaster Mini Apps make feed-native, wallet-aware apps discoverable and
  transactional without app-store friction.
- AT Protocol's Lexicon approach points toward interoperable records rather
  than one closed social database.

Build implication:

Vibeclubs should make proof artifacts and exports adapter-ready first. Wallet
and protocol adapters come after the lock-in loop produces proof people want to
move.

### Web4 Communities

Needs:

- agent identities and permissions, not shared API keys,
- consent before data access and tool invocation,
- visible approvals before writes, external sends, role changes, or value
  movement,
- audit logs for agent actions,
- connectors that expose resources, prompts, and tools in a standard way,
- human-readable exports and machine-readable bundles.

Evidence:

- MCP defines tools, resources, and prompts as standard integration primitives
  for AI applications, with explicit security and consent guidance.
- The MCP resources spec frames resources as application-driven context that can
  be listed, selected, read, and subscribed to.
- Frontiers' Web 4.0 paper frames Web4 as autonomous AI agents operating across
  decentralized ecosystems with trust and governance requirements.
- Gravitee's 2026 AI agent security report argues agent adoption is moving
  faster than governance, with weak security approval, monitoring, and agent
  identity.
- Microsoft's 2026 sovereignty checklist frames digital sovereignty as ongoing
  risk management across AI, cybersecurity, and privacy requirements.

Build implication:

Vibeclubs should treat agents as accountable operators inside a sovereign
runtime: every tool call gets a ledger row, every dangerous action gets host
approval, every output can be exported or deleted according to consent.

## Segment-Specific Experience Map

| Segment | Primary desire | Vibeclubs experience | First connector |
| --- | --- | --- | --- |
| Builder crews | Focus, proof, async momentum | Lock-in blocks, cards, GitHub proof | GitHub |
| Creator cohorts | Status, retention, launch assets | Host cockpit, recaps, social drafts | Discord |
| Founder groups | Progress and accountability | Weekly lock-ins, sponsor-ready proof | Slack |
| Web3 holder groups | Trust, access, contribution proof | Optional token gate, public cards | Guild/Collab.Land |
| DAO workstreams | Governance and execution memory | Proposal summaries, review queue | Snapshot |
| Fan/creator worlds | Shared experiences and social artifacts | Feed-native proof, remixable cards | Farcaster |
| Agent-native teams | Safe delegation | MCP resources/tools with approval | MCP |

## Product Principles

- Start with the ritual, not the protocol.
- Make every adapter optional.
- Treat consent as structured data.
- Treat agent autonomy as a privilege earned through evals and logs.
- Keep external sends and role changes behind host approval.
- Let the export bundle be the bridge to future Web3 and Web4 systems.

## Source Links

- Circle 2026 Community Trends Report: https://circle.so/2026-community-trends-report
- Deloitte 2026 Digital Media Trends:
  https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey.html
- Discord Activities docs: https://docs.discord.com/developers/activities/overview
- Slack Workflow Builder:
  https://slack.com/features/workflow-automation
- Farcaster Mini Apps: https://miniapps.farcaster.xyz/
- AT Protocol overview: https://atproto.com/guides/overview
- Snapshot docs: https://docs.snapshot.box/
- Guild docs: https://docs.guild.xyz/guild
- Collab.Land: https://collab.land/
- Collab.Land security: https://collab.land/security
- MCP intro: https://modelcontextprotocol.io/docs/getting-started/intro
- MCP specification: https://modelcontextprotocol.io/specification/2025-03-26
- MCP resources:
  https://modelcontextprotocol.io/specification/2025-06-18/server/resources
- Frontiers Web 4.0 paper:
  https://www.frontiersin.org/journals/blockchain/articles/10.3389/fbloc.2025.1591907/full
- Gravitee State of AI Agent Security 2026:
  https://www.gravitee.io/blog/state-of-ai-agent-security-2026-report-when-adoption-outpaces-control
- Microsoft sovereignty checklist:
  https://www.microsoft.com/en-us/microsoft-cloud/blog/2026/05/07/your-ai-steering-committees-2026-checklist-sovereignty/
