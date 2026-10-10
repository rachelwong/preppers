# 0003 — Drizzle for database access

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

The BFF needs typed queries, transactions across several tables (checkout, webhook) and versioned migrations. Rachel is new to SQL and wants to learn it.

## Options

1. supabase-js Data API — easiest start, but multi-table transactions need database functions.
2. Prisma — friendliest for beginners, hides most SQL, heavier runtime.
3. Drizzle — reads close to SQL, TypeScript schema, SQL migration files, light on serverless.
4. Plain postgres.js — most SQL practice, least type help.

## Decision

Drizzle, connected through the Supabase pooler with `prepare: false`. Turn off the Supabase Data API.

## Consequences

- SQL is learned along the way; migrations are readable in each PR.
- Steeper first week than Prisma.
- Row-level security is on with no policies, as a backstop.
- Stages: 0.3 onward. Guide: https://supabase.com/docs/guides/database/drizzle
