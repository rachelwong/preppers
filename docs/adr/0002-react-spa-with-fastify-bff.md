# 0002 — React SPA with a Fastify BFF

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Prepper needs auth, payments and secret keys handled on a server. The trial's goals include backend practice and a clear BFF boundary.

## Options

1. Next.js — one app, but hides where the server boundary is.
2. React SPA + Fastify BFF — two apps, a clear HTTP boundary, more backend practice.
3. React SPA talking to Supabase directly — least code, but tokens and business rules live in the browser.

## Decision

Option 2. `web` is a Vite React SPA. `api` is a Fastify server that owns sessions, secrets and every database call. No Next.js.

## Consequences

- The browser only holds an httpOnly session cookie.
- The API's OpenAPI spec keeps both sides in step (see ADR 0009).
- Two deploy targets to manage (see ADR 0004).
- Stages: 0.2, 0.4, 1.1–1.6.
