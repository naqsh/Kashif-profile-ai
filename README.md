# Kashif Jilani — Principal Software Engineer / Tech Lead

Local-first developer portfolio with an **AI Digital Twin**, built from the Qasir Profile AI template (Next.js 16, React 19, TypeScript, Tailwind CSS 4).

**Stack highlights:** .NET Core · C# · ASP.NET · SQL Server · Microsoft Azure · Angular · Technical leadership (12+ years)

## Quick start

```bash
cd Profile/Kashif-profile-ai-main
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Copy values from `.env.example` into `.env` as needed. OpenRouter keys for the Digital Twin should already be present in `.env`.

- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Sanity (`NEXT_PUBLIC_SANITY_PROJECT_ID`) can stay empty — `/blogs` and `/studio` routes remain, but CMS content will be empty until configured
- Force OpenRouter: `NEXT_PUBLIC_DIGITAL_TWIN_FORCE_PROVIDER=openrouter`

## Profile content

Canonical data lives in `src/lib/constants.ts`. Digital Twin grounding is in `src/lib/digital-twin-knowledge.ts`. Source CV materials are under `doc/assets/`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright |

## License

MIT
