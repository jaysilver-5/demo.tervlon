# Tervlon

Structured sprint simulation platform for developers.

## Project Structure

```
tervlon/
├── apps/
│   ├── web/                  # Next.js 15 frontend (Tailwind v4)
│   │   ├── src/
│   │   │   ├── app/          # App router (pages, API routes, layout)
│   │   │   └── components/   # React components
│   │   └── ...
│   └── api/                  # NestJS backend (Slice 1)
├── packages/
│   └── shared/               # Shared TypeScript types
├── simulations/              # Simulation content (starter code + tests)
│   └── ecommerce-api/        # First simulation
├── docker/                   # Dockerfiles for evaluation containers
├── pnpm-workspace.yaml       # Workspace config
└── package.json              # Root scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Setup

```bash
# Install all dependencies
pnpm install

# Run the frontend (landing page)
pnpm dev:web

# Run both frontend and backend (once API is built)
pnpm dev
```

### Development

```bash
# Run only the Next.js frontend
pnpm dev:web
# → http://localhost:3000

# Run only the NestJS backend (Slice 1+)
pnpm dev:api
# → http://localhost:3001
```

## Build Slices

- **Slice 0** ✅ Landing page + early access signup
- **Slice 1** Auth + app shell
- **Slice 2** Simulation data + journey view
- **Slice 3** Workspace (Monaco Editor)
- **Slice 4** AI agents (PM + Teammate)
- **Slice 5** Evaluation pipeline (Docker + AI review)
- **Slice 6** Scoring, ticket flow, scorecard

## Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS v4, Framer Motion
- **Backend:** NestJS (Slice 1+)
- **Database:** PostgreSQL + Prisma (Slice 1+)
- **AI:** Anthropic Claude API (Slice 4+)
- **Execution:** Docker containers (Slice 5+)