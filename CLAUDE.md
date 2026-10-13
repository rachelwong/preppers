# CLAUDE.md — Preppers

Read this first in every session on this repo.

## Roles

- Rachel writes all the code. She is learning backend and SQL; explain backend choices in plain terms.
- Claude plans, writes each stage's feature doc, reviews code, and keeps docs in sync.
- Do not write application code into the repo unless Rachel asks for a specific snippet.
- Docs are for Rachel to code from: plain steps, file names, routes, tables, rules, official links. Short shapes only (a route, a type, a SQL clause), no full implementations.

## Files for Claude vs people

- `CLAUDE.md` files are for Claude. There is one here and one in each of `web`, `api` and `e2e` with rules for that folder. Read the root one, then the one for the folder you're working in.
- `README.md` files are for people. Keep them plain, friendly and free of Claude instructions.

## Source of truth

1. [Notion Preppers page](https://app.notion.com/p/rachelwong/Preppers-3e3375d34b348008ac5dc6f1bc3dc7c0) — ideas, features, scope.
2. `docs/plan/` — build plan (mirrors the Claude doc "Preppers — Staged Build Plan").
3. `docs/adr/` — decisions. `docs/data-model/entities/` — tables. `docs/features/` — per-stage instructions.

If code and docs disagree, raise it; don't silently pick one.

## Starting a stage ("start X.Y")

1. Read the current code and the scope of every later stage in `docs/plan/08-stages.md`.
2. List anything that would block or force rework later. Rachel decides.
3. Write `docs/features/X.Y-<name>.md` from `docs/features/_template.md`.
4. Wait for Rachel to review the doc before she codes.

## Reviewing a stage

Check, in order:

1. The feature doc's Done and Check lines.
2. `docs/plan/04-business-rules.md` rules the stage touches.
3. Status changes only through `transition()`; each writes a `StatusEvent` in the same transaction.
4. Money in integer cents; dates as `timestamptz`/ISO UTC; display in Australia/Brisbane.
5. IDs for ownership come from the session, never the request body.
6. No secrets in code, docs or the browser bundle.
7. No imports across app folders. Web and api only share the OpenAPI contract.
8. Tests: happy path plus each rule's failure path. If the stage completes a critical path (`docs/plan/12-testing.md`), its scenario in `e2e` is added and the CI video shows the whole journey.
9. Diff under ~300 lines (excluding lockfiles and generated files).

Report findings as a numbered list: file, line, problem, why it matters, suggested fix in words.

## Keeping docs in sync

- After each stage, propose doc changes as: doc, old text, new text, evidence (PR/commit/decision).
- Apply only what Rachel approves. Repo docs go in the same PR; Notion and the Claude doc via connectors.
- Never delete doc content or change Notion without a yes.
- Rewrite docs as the current truth. No strikethrough, no "superseded" notes. History lives in git and ADRs.
- At the end of each phase, reread all docs against `main` and report drift.

## Writing style for docs

- Bullet points and numbered lists. Short sentences. Plain English.
- Diagrams (Mermaid) with a step-by-step explanation for anything complex.
- Australian spelling.

## Stack (see docs/plan/03-architecture.md)

- Two self-contained apps, each with its own `package.json`, lockfile and dependencies: `web` (React, Vite, TanStack, Tailwind CSS with shadcn/ui) and `api` (Fastify BFF). No shared package. The repo root holds docs only.
- The API's OpenAPI spec is the contract between them. The web app generates its API types from it.
- `e2e` holds the Playwright critical-path tests, also self-contained.
- Supabase Postgres via Drizzle; Supabase Auth, Storage, `pg_cron`; PostGIS.
- Stripe test mode with Connect. Resend email. Google Maps and Geocoding. Sentry and pino.
- Vercel: two projects from this repo; web forwards `/api/*` to api.

## Commands

Filled in during stage 0.1. Run each inside its own app folder. Expected:

- `api`: `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm db:reset`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:seed-admin` (makes the first admin from `SEED_ADMIN_EMAIL`), `pnpm openapi` (writes `openapi.json`)
- `web`: `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm gen:api` (types from the API's `openapi.json`)
- `e2e`: `pnpm install`, `pnpm test` (needs web and api running)

## Conventions

- Branches: `stage/<phase>.<n>-<name>`.
- Error response: `{ code, message, details? }` with the right HTTP status (400 validation, 401 no session, 403 not allowed, 404, 409 bad transition or conflict, 422 can't process, 429 rate limit).
- Postgres names `snake_case`; TypeScript `camelCase`.
- One API client in `web`; TanStack Query keys in one file.
