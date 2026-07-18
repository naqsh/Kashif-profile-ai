# Design: "Agents Are Creating Agents" Blog Post

## Context

The site's blog (Sanity CMS, `/blogs`) currently has two live posts: a Next.js 16/React 19 code-splitting guide and a Production-Grade FastAPI guide. Both follow a pattern: a draft markdown file authored in `docs/`, a matching hero image in `docs/assets/`, grounded in real code from the author's own open-source projects (`job-discovery`, `daily-briefing`), then published to Sanity Studio.

The user wants a third post on the topic "Agents are creating Agents — really," arguing that the SDLC moves faster when security, observability, and related practices are built in from day one rather than retrofitted. The post should be ATS-friendly, match the current site's professional/production-grade tone, target 2026 industry standards, and be written in British English in an accessible, human style. A LinkedIn post will follow later, derived from this blog post, but is out of scope for this design.

Source material verified directly from GitHub via `gh api` (not fetched from memory):
- `qasirdev/daily-briefing/README.md`
- `qasirdev/daily-briefing/SECURITY.md`

These confirm a real, working six/seven-agent pipeline (Task → Calendar → Focus → Verification → Adversarial → Critic → Orchestrator) where agents verify, red-team, and gatekeep each other's output — a concrete, non-hypothetical instance of "agents creating/checking agents." The repo also documents OWASP GenAI Top 10 controls, OpenTelemetry/Prometheus observability with a Dwell Time SLO, and supply chain controls (Cosign signing, AI-BOM, OpenSSF Scorecard) — giving the post real evidence rather than abstract claims.

## Central Example

`daily-briefing`'s multi-agent pipeline is the spine of the post. Every claim about security, observability, verification, and speed ties back to concrete, named components from that repo (Input Security Gate, Spotlighting, Verification/Adversarial/Critic agents, OpenTelemetry tracing, Dwell Time SLO, Cosign/AI-BOM).

## Title

**Chosen:** "Agents Are Creating Agents. Here's What That Does to Your SDLC."

Subtitle (for SEO/meta and hero image): *Why security and observability from day one make the software development lifecycle faster, not slower.*

## Structure

1. **Hook — "Agents are creating agents. Really."** Grounded opener: not hypothetical — a live pipeline where an Orchestrator supervises agents, an Adversarial agent red-teams a Focus agent's plan, and a Critic agent gatekeeps output before anything reaches a user.
2. **Why this breaks the old SDLC** — traditional SDLC assumes a human writes code, a human reviews it, tests run afterwards. When agents generate and critique each other's output continuously, security/observability can't be a later retrofit — decisions ship in seconds, continuously.
3. **Pillar 1 — Security from day one** — Input Security Gate, spotlighting for indirect injection, OWASP GenAI Top 10 mapping, JIT credentials (<15 min TTL). One short illustrative snippet (schema/gate shape, not a full implementation).
4. **Pillar 2 — Observability from day one** — OpenTelemetry trace correlation across every agent hop, Prometheus SLOs, Dwell Time <1hr metric. One short illustrative snippet (trace ID propagation).
5. **Pillar 3 — Verification and CI/CD as a built-in reflex** — Verification/Adversarial/Critic trio as a runtime mirror of CI (tests, red-teaming, gatekeeping) that runs on every request, not just every merge; brief mention of supply chain controls (Cosign, AI-BOM, OpenSSF Scorecard) as CI/CD extended into agent-shipped output.
6. **What actually got faster** — concrete before/after grounded in the repo's own numbers: Dwell Time SLO <1hr, ~90% token cost reduction as a side effect of disciplined day-one design (not the main point, but evidence that rigour and speed aren't opposed). Include one sentence noting that architectural decisions (governance, rollback, incident response) were documented as agents were built, not bolted on afterwards — reinforcing the "day one" thesis without touring the docs folder.
7. **A practical checklist** — 4-6 items a reader can apply immediately, mirroring the FastAPI post's closing checklist format.
8. **Closing** — link to `daily-briefing` on GitHub and qasir.co.uk, consistent with the FastAPI post's closer.

## Style Constraints

- **Language:** British English throughout (organise, colour, defence, optimise, etc.).
- **Tone:** human, accessible, easy to follow — narrative/opinion-led rather than a dense technical walkthrough. Less jargon-dense than the FastAPI post.
- **Code density:** light — 2, at most 3, short illustrative snippets pulled from real patterns in `daily-briefing`. No full multi-file walkthroughs.
- **Length:** ~7-9 minute read, consistent with the two existing posts (~8 min each).
- **ATS/SEO:** natural keyword coverage (multi-agent systems, OWASP GenAI, OpenTelemetry, CI/CD, SDLC, agentic AI) woven into prose, not a keyword-stuffed block — matching how the existing posts integrate terms naturally rather than via a dumped keyword list.

## Main Image

Same visual template as the two existing hero images (`docs/assets/blog-nextjs16-code-splitting-main.png`, referenced in the FastAPI post): dark navy/purple gradient background, glassmorphic cards with glowing purple/blue/cyan borders, bold white title text with a purple-gradient subtitle, subtle brand line-art motif in a corner.

New composition: an Orchestrator node branching into agent nodes (Task, Calendar, Focus, Verification, Adversarial, Critic), with a visible feedback/verification loop arrow looping back into the Orchestrator — visually representing agents checking agents, distinct from the existing bundle-splitting cube diagram.

Saved to `docs/assets/blog-agents-creating-agents-main.png`.

## File Locations

- Draft markdown: `docs/agents-creating-agents-sdlc.md`
- Hero image: `docs/assets/blog-agents-creating-agents-main.png`

## Out of Scope

- Publishing to Sanity Studio (the user publishes drafts manually, as with the other two posts).
- The LinkedIn post — explicitly deferred to a follow-up pass after this blog post is finalised.
- **Prompt versioning system** (`/prompts/*`, 11-file structure per agent) — a distinct topic (prompt engineering discipline), better suited to its own future post than folded into this one.
- **`/infrastructure` folder detail** (Docker, Nginx, alerting/monitoring configs) — outcome already covered via Pillar 3's supply chain mention (Cosign, AI-BOM); the folder's implementation detail belongs in a deployment-focused post.
- **The wider `/docs` folder** (20+ files: GOVERNANCE, HITL-ARCHITECTURE, INCIDENT-RESPONSE, RED-TEAMING, TOKEN-EFFICIENCY, etc.) — real evidence of discipline, but cataloguing it reads as a documentation flex rather than supporting the argument. Reduced to the single reinforcing sentence in section 6.
- **`/docs/jira-tickets-json`** (epics/tasks) — project-management artefact, not an SDLC principle; omitted entirely as it would read as padding and undercut the accessible tone.

## Verification

- Read the finished draft aloud (mentally) for British spelling consistency and tone.
- Cross-check every factual claim (agent names, SLO figures, security control names) against the fetched `README.md`/`SECURITY.md` content to ensure nothing is invented.
- Compare structure and length against `docs/fastapi-production-guide.md` for consistency.
- Render the hero image and visually compare against `docs/assets/blog-nextjs16-code-splitting-main.png` for style consistency.
