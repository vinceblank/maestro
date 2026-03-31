# Maestro

The ensemble dashboard for [claude-tempo](https://github.com/vinceblank/claude-tempo) — a web UI for managing ensembles, communicating with conductors, and monitoring player activity.

## What is this?

Maestro is the human interface for claude-tempo. It provides:

- **Ensemble management** — create, view, and disband ensembles
- **Maestro chat** — communicate with the conductor via a chat interface
- **Player monitoring** — view all players, their status, and message history
- **Recruiting** — start new player and conductor sessions from the dashboard
- **Player identity** — each player gets a unique color and instrument icon

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [Temporal](https://docs.temporal.io/cli) dev server running
- [claude-tempo](https://github.com/vinceblank/claude-tempo) MCP server installed and configured

Maestro depends on the `claude-tempo` npm package (^0.1.3+) for shared types, signal/query definitions, config helpers, spawn utilities, and the pre-built workflow bundle.

### Setting up claude-tempo

Maestro requires a running Temporal server and the claude-tempo MCP server. The fastest way:

```bash
npm install -g claude-tempo
claude-tempo up
```

Or manually:

```bash
git clone https://github.com/vinceblank/claude-tempo.git
cd claude-tempo && npm install && npm run build
temporal server start-dev
```

See the [claude-tempo README](https://github.com/vinceblank/claude-tempo) for full setup instructions.

## Quick start

```bash
# Clone and install
git clone https://github.com/vinceblank/maestro.git
cd maestro && npm install

# Start the dashboard
npm run dev
```

The workflow bundle is included in the `claude-tempo` package and resolved automatically at startup. The `build:workflows` script is only needed if you're developing against a local copy of the workflow source files.

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## How it works

### Architecture

Maestro is a Next.js app that connects directly to Temporal to query and signal player workflows. It doesn't run its own backend — it uses Temporal as the data layer. Types, signal/query definitions, config helpers, and terminal spawn logic are all imported from the `claude-tempo` package (single source of truth).

```
Browser → Next.js API Routes → Temporal Client → Player Workflows
```

### Key concepts

- **Maestro** — A lightweight Temporal workflow representing you (the human) in the ensemble. The dashboard auto-creates it. Messages you send go through maestro's workflow.
- **Conductor** — A Claude Code session that orchestrates the ensemble. The dashboard can recruit one via the "Start Conductor" button. All your messages route to the conductor.
- **Players** — Claude Code sessions doing work. View their message history and send them direct messages from the dashboard.

### Workflow bundle

The workflow bundle (`workflow-bundle.js`) is shipped inside the `claude-tempo` npm package and resolved automatically at startup. Maestro's Temporal worker loads this bundle to serve workflow queries and signals.

If the workflow protocol changes upstream, update `claude-tempo` to the latest version:

```bash
npm update claude-tempo
```

A local `workflows/` directory and `build:workflows` script are kept as a fallback for development against unreleased workflow changes.

## Development

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run build:workflows  # Rebuild Temporal workflow bundle
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TEMPORAL_ADDRESS` | `localhost:7233` | Temporal server address |
| `TEMPORAL_NAMESPACE` | `default` | Temporal namespace |
| `CLAUDE_TEMPO_TASK_QUEUE` | `claude-tempo` | Temporal task queue name |

Create a `.env.local` file to override defaults:

```
TEMPORAL_ADDRESS=localhost:7233
```

## Tech stack

- **Framework**: [Next.js](https://nextjs.org/) 16+ (App Router)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Temporal**: [@temporalio/client](https://docs.temporal.io/) for workflow queries and signals
- **Shared logic**: [claude-tempo](https://github.com/vinceblank/claude-tempo) — types, Temporal signals, config helpers, and cross-platform terminal spawning
- **Icons**: [Lucide](https://lucide.dev/) via lucide-react
