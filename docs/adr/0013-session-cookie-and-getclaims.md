# 0013 — Session in httpOnly cookies, checked with getClaims

- **Status:** accepted
- **Date:** 2026-10-13

## Problem

The API must know who is calling on every request, without the browser holding tokens. Checking with Supabase on every request would be slow, and the web app needs a cheap way to guard routes.

## Options

1. Tokens in chunked httpOnly cookies, checked locally with `getClaims()` — Supabase's documented server pattern, no extra table. A token stays valid until it expires.
2. Opaque session ID in the cookie, tokens in our own `sessions` table — instant revoke, but more code and a table to keep.
3. `getUser()` on every request — always current, but a network call to Supabase for every API call.
4. Supabase client in the browser — least server code, but breaks the BFF boundary (see ADR 0002).

## Decision

Option 1. The `authenticate` hook reads the cookie, checks the token with `getClaims()`, refreshes when expired, then loads the account from Postgres. Route guards reject with 401 or 403. The web app caches `GET /api/me` in TanStack Query and uses it only for router redirects.

## Consequences

- No Supabase call per request, provided the project uses asymmetric JWT signing keys. Stage 1.2 checks this.
- A deactivated account is blocked at once by the account lookup, even if its token is still valid.
- After sign-out an access token lives until expiry (default 1 hour), but the cookie is cleared.
- If instant revoke becomes necessary, option 2 can replace the cookie contents without changing guards or the web app.
- No global auth context in the web app; `/me` stays in TanStack Query.
- Details: [Authentication](../plan/15-authentication.md).
- Stages: 1.1, 1.2, 1.3, 1.4.
