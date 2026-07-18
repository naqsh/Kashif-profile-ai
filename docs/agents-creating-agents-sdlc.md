---
title: "Agents Are Creating Agents. Here's What That Does to Your SDLC."
date: "2026-07-07"
description: "When AI coding agents build AI runtime agents, traditional software development breaks. Here is how to enforce security, observability, and verification from day one."
tags: ["multi-agent systems", "SDLC", "OWASP GenAI", "OpenTelemetry", "CI/CD", "agentic AI", "security", "observability"]
image: "/assets/blog-agents-creating-agents-main.png"
readingTime: "8 min read"
---

A year or two ago, "agents building agents" sounded like a conference slide — a nice idea for 2027, not something running in production today. But it isn't hypothetical any more. 

In my latest open-source project, [daily-briefing](https://github.com/qasirdev/daily-briefing), this phrase has a literal, double meaning. 

First, at the **Development Layer**, six specialised AI coding agents (defined in `.cursor/rules`) are actively architecting and writing the codebase. Second, at the **Runtime Layer**, they have built an eight-agent pipeline (in `backend/agents`) where an Orchestrator supervises specialist agents like the Adversarial and Critic to safely execute tasks.

When agents are writing the code *and* executing the code, the traditional Software Development Lifecycle (SDLC) doesn't just creak — it shatters. The teams who feel that friction the least in 2026 are the ones treating security, observability, and verification as day-one architectural reflexes, not late-stage additions.

---

## The Double-Layered Agent Architecture

To understand the SDLC impact, you have to look at how these two layers interact:

1. **The Builders (`.cursor/rules`):** Six highly scoped coding agents act as the engineering team. They don't just generate boilerplate; they enforce 2026 industry standards, ensuring the generated Python code adheres strictly to predefined architectural boundaries.
2. **The Product (`backend/agents`):** The output is an eight-agent LangGraph pipeline. It operates as a continuous feedback loop: **Orchestrator → Task → Calendar → Focus → Verification → Adversarial → Critic → Orchestrator**. 

If security and observability aren't built into both layers from the first commit, you don't get a slower, safer system. You get a terrifyingly fast system with no way of knowing whether it is secure.

---

## Pillar One: Security as a Foundation

In a system where an AI is writing code for another AI to execute, trust is a vulnerability. Nothing an agent produces is trusted purely by virtue of its origin. 

In *daily-briefing*, every external input — whether it's a calendar event or a generated task — passes through an **Input Security Gate** before it reaches a model. This includes a regex layer, a jailbreak classifier (PromptGuard 2), and a constitutional check. Anything external is also wrapped with **spotlighting** to defend against indirect prompt injections.

```python
class InputSecurityGate:
    """Runs untrusted input through layered checks before any LLM call."""

    async def scan(self, payload: str) -> SecurityVerdict:
        if self.regex_scanner.matches(payload):
            return SecurityVerdict.blocked("pattern_match")

        if await self.prompt_guard.is_jailbreak(payload):
            return SecurityVerdict.blocked("jailbreak_detected")

        if not self.constitutional.passes(payload):
            return SecurityVerdict.blocked("policy_violation")

        return SecurityVerdict.clean(spotlighted(payload))
```

This maps directly onto the **OWASP GenAI Top 10**. Furthermore, the pipeline relies on **JIT (Just-In-Time) credentials**: tokens that live for less than 15 minutes and expire automatically, ensuring an exploited agent has no standing permissions to misuse. 

---

## Pillar Two: Observability Across Eight Hops

With one service and one human team, "just check the logs" is a reasonable debugging strategy. With eight runtime agents handing work to each other dozens of times a minute, it isn't. By the time an error manifests at the Orchestrator, the actual hallucination might have occurred three agents earlier.

The fix is a production-grade necessity: a trace ID generated at the front door and propagated through every single agent hop.

```python
async def correlation_id_middleware(request: Request, call_next):
    """Propagates one trace ID through every agent in the pipeline."""
    trace_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request_id_ctx.set(trace_id)

    response = await call_next(request)
    response.headers["X-Request-ID"] = trace_id
    return response
```

On top of this, the project leverages **OpenTelemetry** for distributed tracing and **Prometheus** for metrics. This allows us to enforce strict Service-Level Objectives (SLOs), such as a **Security Dwell Time of under one hour** — measured and alerted upon instantly.

---

## Pillar Three: Verification as a Reflex

Traditional CI/CD gives you tests and a final approval gate before a human merges code. In an agentic system, that same verification shape exists — but it runs on *every single request*, not just every pull request.

In the *daily-briefing* runtime, the **Verification agent** checks the Focus agent's output for schema compliance. The **Adversarial agent** then deliberately attempts to break it, hunting for logical fallacies and bad assumptions. Finally, the **Critic agent** does a strict security pass. If it flags a violation, the request goes straight to a dead-letter queue. It is never retried; it is only escalated. 

This mirrors the development layer, where the six `.cursor/rules` coding agents continuously red-team and verify each other's code generation against supply chain controls, such as **Cosign** container signing and **AI-BOM** (AI Bill of Materials) tracking.

---

## What Actually Got Faster

Here is the part that tends to surprise people: none of this strict SDLC governance slowed the project down. In fact, it is the exact reason the development agents could build it so rapidly.

- **Dwell time under 1 hour:** Security-relevant events are caught immediately because tracing existed from the first agent, not the fifth incident.
- **70–90% reduction in token costs:** Prompt caching and token efficiency were architected into the `.cursor/rules` from the outset, rather than retrofitted once costs spiked.
- **Zero Retrofits:** Architectural decisions were explicitly coded into the development agents' instructions, eliminating the need to rewrite brittle, auto-generated code later.

When you stop spending half your sprint fixing structural mistakes, your velocity naturally increases.

---

## The 2026 Industry Checklist

If you are building an architecture where agents are creating or supervising other agents, here is where you must start:

1. **Treat all inputs as untrusted:** Wrap and scan data; never just parse it blindly.
2. **Enforce unbroken traceability:** If an agent drops a trace ID, you no longer have observability — you just have isolated logs.
3. **Mandate runtime verification:** A dedicated Critic or Adversarial agent must evaluate outputs before they reach a user.
4. **Define "escalate, don't retry":** Know exactly when a request should be permanently halted to prevent silent security failures.
5. **Measure what matters from Day 1:** Establish SLOs like latency and dwell time before your first production release.

Agents are creating agents. The SDLC has permanently changed, but the teams building security, observability, and verification into their pipelines from day one are the ones shipping faster, safer, and at true production grade. 

You can explore the full dual-layer architecture, from the six coding agents in `.cursor/rules` to the eight runtime agents in `backend/agents`, over at the [daily-briefing](https://github.com/qasirdev/daily-briefing) repository on GitHub.
