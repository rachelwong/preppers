# 0006 — One transition function and a status event log

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Seven entities have statuses. The Miro diagram used Active/Inactive/Deleted plus `deletedAt` everywhere, which means different things per entity and loses history.

## Options

1. Free updates to status columns — fast, but rules drift and history is lost.
2. A status map per entity, one `transition()` function, and a `StatusEvent` row per change.

## Decision

Option 2. Allowed moves live in `api/src/services/status.ts`. `transition()` checks the map, updates the row and writes `StatusEvent` in one transaction, or returns 409.

## Consequences

- Every status change has who, when and why.
- No `deletedAt` columns; nothing is deleted; `deactivated` and `archived` are statuses.
- Reviews reject any direct status write.
- Stages: 0.6 and every stage that changes a status.
