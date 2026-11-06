# CLAUDE.md — Preppers

Coding rules: @AGENTS.md

Hobby app, few users. Build only for realistic edge cases.

## Layout

- `api`: Fastify, Drizzle, Supabase (Postgres, Auth). Own package.json.
- `web`: React, Vite, TanStack, Tailwind, shadcn/ui. Own package.json.
- web's API types are generated from api's `openapi.json`. No imports between apps.
- Scope: `docs/stages.md`. Rules: `docs/rules.md`. Terms: `CONTEXT.md`. Decisions: `docs/adr/`. If code and docs disagree, ask.

## Workflow

1. Starting a stage: read its scope and later stages; flag anything that forces rework. Non-trivial change: short plan first. Payments, auth, migrations: feature doc in `docs/features/`, Rachel approves.
2. Feature or bug fix: invoke `mattpocock-skills:tdd` skill. Failing test first, then build until it passes. Never weaken a test to make it pass. Guidance: `docs/testing.md`.
3. Route changed: `npm run openapi` (api), `npm run gen:api` (web). A Stop hook runs test, lint and type-check in changed apps.
4. Stage or bug fix done: run `code-reviewer` and `docs-checker` once, in parallel. Fix "Must fix" items; propose doc changes for Rachel to approve. Ad hoc work: Rachel runs `/check-code` and `/check-docs`.
5. Never commit, push or branch. Present the diff and a suggested commit message (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
6. Rachel corrects code quality: record the rule in `AGENTS.md`, an app `CLAUDE.md` or a `.claude/skills/` skill, then say where.

## Commands

- api: `npm run dev`, `npm test`, `npm run db:migrate`, `npm run openapi`
- web: `npm run dev`, `npm test`, `npm run gen:api`
