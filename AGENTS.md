<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start         # Serve production build
npm run lint          # ESLint (eslint-config-next core-web-vitals + typescript)
npm run test           # Vitest unit/component tests (watch mode by default)
npm run test:ui        # Vitest UI
npm run test:e2e       # Playwright E2E (auto-starts dev server)
npm run test:e2e:ui    # Playwright UI mode
npm run clean          # Remove .next, caches, coverage, test artifacts
```

Single test file: `npx vitest run src/lib/digital-twin-quota.test.ts`
Single Playwright spec: `npx playwright test tests/<file>.spec.ts`

Node version is pinned via `.nvmrc` (Node 24 — CI runs on Node 24; Node 20 is deprecated on `ubuntu-latest`).

Vitest excludes `tests/**` (Playwright's directory) and `*.spec.ts`; unit tests live alongside source as `*.test.ts`.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, ShadCN/Radix UI. Route handlers use the async `params: Promise<{...}>` convention (see `src/app/blogs/[slug]/page.tsx`).

### AI Digital Twin (dual-provider chat)

The chat widget can run on two independent providers, resolved client-side:

- **Chatbase** — managed embed widget (`src/components/chatbase-embed.tsx`), free/cheap default when `NEXT_PUBLIC_CHATBASE_EMBED_ID` is set.
- **OpenRouter** — self-hosted streaming chat via `/api/chat` (`src/app/api/chat/route.ts`), using the `openai` SDK pointed at OpenRouter's base URL with a model fallback chain (`route: "fallback"`, `models: [...]`).

Provider selection logic lives in `src/lib/digital-twin-provider.ts` (`resolveProvider`): an explicit `NEXT_PUBLIC_DIGITAL_TWIN_FORCE_PROVIDER` env var wins; otherwise it falls back to a stored provider choice, a monthly Chatbase budget mirror (`isMirrorBudgetExhausted`), or defaults to Chatbase-if-configured else OpenRouter. `src/components/digital-twin-orchestrator.tsx` is the component that wires this decision to the UI. Chatbase message counts are mirrored server-side via `/api/usage/chatbase-message` against `DIGITAL_TWIN_CHATBASE_MONTHLY_BUDGET` so the app can fail over to OpenRouter before hitting Chatbase's real limit.

Rate limiting for the OpenRouter path is HMAC-signed, cookie-based (`src/lib/digital-twin-quota.ts`): `dt_visit` and `dt_day` cookies carry a `base64url(payload).signature` value verified with `timingSafeEqual`, keyed by `DIGITAL_TWIN_QUOTA_SECRET` (falls back to `OPENROUTER_API_KEY`). Limits are `DIGITAL_TWIN_MAX_QUESTIONS_PER_VISIT` / `_PER_DAY` (0 = unlimited); conversation history sent to the model is trimmed to `DIGITAL_TWIN_MAX_HISTORY_TURNS` complete user/assistant pairs (`trimConversationHistory`). The chat route streams via SSE (`data: {...}\n\n`, terminated by `data: [DONE]`) and emits a final `run_metadata` event with latency/tokens/cost/status for observability (`src/components/digital-twin-observability.tsx`).

The system prompt / knowledge base for the twin is built in `src/lib/digital-twin-knowledge.ts` (see `docs/prompt-digital-twin-data.md` for the underlying content source).

### Blog (Sanity CMS)

Headless blog under `/blogs`, content and schema in `src/sanity/`:

- `src/sanity/schema/` — Sanity document schemas (`author`, `blog-post`, `category`).
- `src/sanity/lib/client.ts` — two clients: `client` (CDN, published content) and `previewClient` (no CDN, draft perspective, requires `SANITY_API_TOKEN`). Also exports a raw `sanityFetch` helper that hits Sanity's HTTP API directly with Next's `fetch` cache/`tags`/`revalidate` options for ISR — used instead of the SDK client where tag-based revalidation is needed.
- `src/sanity/lib/queries.ts` — GROQ queries (`getBlogPostBySlug`, `getAllBlogSlugs`, `getRelatedBlogPosts`, etc.).
- Studio is embedded in-app at `/studio` (`src/app/studio/[[...tool]]/page.tsx`), configured by `sanity.config.ts` at the repo root.
- Blog posts render Portable Text via `@portabletext/react` (`src/components/blog-content.tsx`).

Sanity env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID` (required for blog), `NEXT_PUBLIC_SANITY_DATASET` (default `production`), `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN` (preview only). Setup/migration context: `docs/SANITY_SETUP_GUIDE.md`, `docs/SANITY_V6_MIGRATION.md`.

### Resume/CV delivery

CV/resume content is fetched from GitHub raw URLs at request time (`src/lib/fetch-resume.ts`, `NEXT_PUBLIC_CV_URL` / `NEXT_PUBLIC_RESUME_TEXT_URL`) rather than bundled, so the CV can be updated without a redeploy. Served at `/resume` (page) and `/resume.txt` (plain text, ATS-friendly route handler).

### SEO / crawler surfaces

Dynamic route handlers generate `sitemap.xml` (`src/app/sitemap.ts`), `robots.txt` (`src/app/robots.ts`), `opengraph-image` (root and per-blog-post), and `/llms.txt` (`src/lib/llms-txt.ts` + `src/app/llms.txt/route.ts`) for LLM/agent crawlers per llmstxt.org. `src/lib/person-json-ld.ts` builds the JSON-LD `Person` schema used in `layout.tsx`.

### Path alias

`@/*` maps to `src/*` (both `tsconfig.json` and Vitest's resolver).

## Testing notes

- Unit tests (Vitest + Testing Library + jsdom) cover the `lib/` layer heavily: quota math, provider resolution, usage tracking, llms.txt generation, contact mailto, chat markdown rendering. Look at the matching `*.test.ts` next to any `lib`/`components` file before changing its behavior.
- Playwright E2E specs live in `tests/` and drive a real `npm run dev` server (`webServer` config in `playwright.config.ts`); CI runs with 1 worker and 2 retries.
