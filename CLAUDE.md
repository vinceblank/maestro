@AGENTS.md

# Maestro

Real-time dashboard for claude-tempo ensembles. Built with Next.js 16 + Temporal.

## Quick Start

```bash
npm install
npm run build:workflows   # Build Temporal workflow bundle
npm run dev               # Start Next.js dev server
```

Requires a running Temporal server at `localhost:7233` (or set `TEMPORAL_ADDRESS`).

## Project Structure

- `app/` — Next.js App Router pages and API routes
- `components/` — React UI components
- `lib/` — Temporal client, shared utilities
- `hooks/` — React hooks (usePlayers, usePlayerDetail, etc.)
- `types/` — Dashboard-specific type re-exports
- `workflows/` — Temporal workflow source files (session, signals, types)

## Key Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run build:workflows` — Compile and bundle Temporal workflows
- `npm run lint` — Run ESLint

## Environment Variables

- `TEMPORAL_ADDRESS` — Temporal server address (default: `localhost:7233`)
- `TEMPORAL_NAMESPACE` — Temporal namespace (default: `default`)
- `CLAUDE_TEMPO_TASK_QUEUE` — Task queue name (default: `claude-tempo`)
