# CLAUDE.md — Preppers

Coding rules: @AGENTS.md

Hobby app, few users. Build only for realistic edge cases.

## Layout

- `api`: Fastify, Drizzle, Supabase (Postgres, Auth). Own package.json.
- `web`: React, Vite, TanStack, Tailwind, shadcn/ui. Own package.json.
- web's API types are generated from api's `openapi.json`. No imports between apps.
- Scope: `docs/plan/08-stages.md`. Decisions: `docs/adr/`. If code and docs disagree, ask.

## Workflow

1. Non-trivial change: short plan first. Payments, auth, migrations: feature doc in `docs/features/`, Rachel approves.
2. Failing test first, then build until it passes. Never weaken a test to make it pass.
3. Route changed: `pnpm openapi` (api), `pnpm gen:api` (web). A Stop hook runs test, lint and type-check in changed apps.
4. Feature done: run `code-reviewer`, fix its "Must fix" items. Stage done: run `docs-checker`, propose its doc changes.
5. Never commit, push or branch. Present the diff and a suggested commit message (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## Commands

- api: `pnpm dev`, `pnpm test`, `pnpm db:migrate`, `pnpm openapi`
- web: `pnpm dev`, `pnpm test`, `pnpm gen:api`
