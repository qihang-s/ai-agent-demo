<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-11
**Commit:** 4046934
**Branch:** main

## OVERVIEW

Next.js 16 + React 19 chat UI backed by a LangChain agent (Vivgrid/OpenAI-compatible). Demo project — two built-in tools: timezone query, math calculator.

## STRUCTURE

```
ai-agent-demo/
├── src/
│   ├── app/
│   │   ├── api/agent/route.ts   # POST /api/agent — invokes LangChain agent
│   │   ├── layout.tsx           # Root layout — zh-CN, Manrope + JetBrains Mono fonts
│   │   ├── page.tsx             # "use client" chat UI — messages, quick prompts, fetch
│   │   └── globals.css          # Tailwind v4 + custom theme tokens + all component CSS (259 lines)
│   └── lib/
│       └── agent.ts             # ChatOpenAI config, tool defs (get_current_time, calculate), createAgent
├── .env.example                 # VIVGRID_BASE_URL, VIVGRID_API_KEY, VIVGRID_MODEL
├── package.json                 # npm scripts: dev, build, start, lint
└── public/                      # Static assets (SVGs)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add a new tool | `src/lib/agent.ts` | Define with `tool()` from `langchain`, add to `tools` array in `createAgent` |
| Change system prompt | `src/lib/agent.ts` | `systemPrompt` param in `createAgent()` |
| Modify chat UI | `src/app/page.tsx` | Client component, all state local (`useState`) |
| Add API route | `src/app/api/*/route.ts` | Next.js App Router convention |
| Adjust theme/colors | `src/app/globals.css` | CSS vars at `:root`, Tailwind `@theme inline` block |
| Change LLM model/provider | `.env.local` | `VIVGRID_MODEL`, `VIVGRID_BASE_URL`, `VIVGRID_API_KEY` |
| Add quick prompt | `src/app/page.tsx` | `quickPrompts` array near top |

## CONVENTIONS

- **Language**: zh-CN throughout (UI copy, comments, system prompt, error messages)
- **CSS strategy**: Tailwind v4 utility classes + custom CSS classes in `globals.css` (`.bubble`, `.chat-panel`, `.hero-panel`, etc.) — NOT CSS modules, NOT styled-components
- **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme inline {}` — no `tailwind.config.js`
- **Fonts**: Manrope (sans) + JetBrains Mono — loaded via `next/font/google`, applied as CSS vars
- **Path alias**: `@/*` maps to `./src/*`
- **TypeScript**: Strict mode, bundler moduleResolution
- **Validation**: Zod v4 for request body parsing in route handlers
- **LangChain imports**: `tool`, `createAgent` from `"langchain"` (not `@langchain/core`)
- **Single-page app**: Only one route (`/`) + one API endpoint (`POST /api/agent`)

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER edit `next-env.d.ts`** — auto-generated
- **NEVER commit `.env.local`** — contains API keys (`.gitignore` covers `.env*`)
- **NEVER use `tailwind.config.js`** — Tailwind v4 uses CSS-based config via `@theme inline`
- **NEVER assume standard Next.js APIs** — Next.js 16 has breaking changes; read `node_modules/next/dist/docs/` first

## UNIQUE STYLES

- All component styling lives in `globals.css` as plain CSS classes (not Tailwind `@apply`)
- Mobile responsive via `@media (max-width: 767px)` block with `!important` overrides
- Glassmorphism aesthetic: `backdrop-filter: blur`, gradient backgrounds, semi-transparent borders
- Chat bubbles: `.bubble-assistant` (white gradient) vs `.bubble-user` (teal-to-cyan gradient, right-aligned)

## COMMANDS

```bash
npm run dev       # Dev server (port 3000)
npm run build     # Production build (includes type check)
npm run start     # Production server
npm run lint      # ESLint (core-web-vitals + typescript)
```

## NOTES

- **Dual lockfiles**: Both `package-lock.json` and `pnpm-lock.yaml` exist — pick one package manager
- **No tests**: Zero test infrastructure — no framework, no test files, no test script
- **No CI/CD**: No GitHub Actions, Dockerfile, or deployment config
- **Debug logs**: `console.log(456, ...)` in `agent.ts:7`, `console.log(123, ...)` in `route.ts:27` — leftover debug statements
- **Calculator uses `Function()` eval**: `src/lib/agent.ts:33` — sandboxed by regex but still `Function()` constructor
- **`getFinalTextContent`**: Utility in `agent.ts` handles both string and array content from LangChain responses
- **No streaming**: Chat responses are full JSON round-trips (not SSE/streaming)
