# 0009 — Self-contained web and api apps

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

The web app and API live in one repo. A shared package for schemas and enums would tie their dependencies and builds together.

## Options

1. pnpm workspaces with a `packages/shared` package — one source for schemas, but the apps depend on each other's build.
2. Fully separate apps; the API's OpenAPI spec is the only contract — each app stands alone; types are generated, not shared.

## Decision

Option 2. `web`, `api` and `e2e` sit at the repo root, with no `apps/` folder around them. Each has its own `package.json`, lockfile and tooling. No app imports another. The repo root holds docs that span the whole product. The API generates `openapi.json` from its zod route schemas; the web app generates its types from that file.

## Consequences

- Either app can be upgraded, moved or deployed on its own.
- Some things are written twice on purpose (e.g. form validation in web, request validation in api). The API is always the final check.
- CI fails if `openapi.json` or the web's generated types are out of date.
- Stages: 0.1, 0.2, 0.4, and every stage that adds a route.
