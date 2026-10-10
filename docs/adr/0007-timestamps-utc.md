# 0007 — Timestamps in UTC

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Times are stored, sent over the API and shown to Brisbane users. Mixing formats causes off-by-hours bugs.

## Options

1. Postgres `timestamp` without time zone — ambiguous.
2. `timestamptz` + ISO 8601 UTC strings + local formatting on screen.

## Decision

Option 2. Postgres `timestamptz` (Drizzle `withTimezone: true`, default `now()`). API sends ISO 8601 UTC ending in `Z`, validated with zod's datetime check. Web formats in `Australia/Brisbane` with `Intl.DateTimeFormat`. Date-only fields use Postgres `date` and `YYYY-MM-DD`.

## Consequences

- One rule everywhere; no time zone columns.
- Tests use a fixed clock.
- Stages: 0.3 onward, 7.3.
