# CLAUDE.md — api

Read the root `CLAUDE.md` first. This file adds rules for the API only.

## Role reminder

- Rachel writes the code and is learning backend and SQL. Explain backend reasons in plain terms, and point to the SQL a Drizzle query produces when it helps.
- Don't write app code unless asked for a snippet.

## Rules to check in review

1. Every route declares zod schemas for its params, body and response. These schemas generate `openapi.json`, the contract the web app builds its types from. Regenerate and commit `openapi.json` whenever a route changes.
2. Errors use `{ code, message, details? }` and the right status: 400, 401, 403, 404, 409, 422, 429. No stack traces in responses.
3. The account and Prepper ID come from the session, never from the request body or params.
4. Every status change goes through `transition()` in `src/services/status.ts` and writes `StatusEvent` in the same transaction.
5. Multi-table writes (checkout, webhook, guest cart merge, hand-over) run in one Drizzle transaction.
6. Money is integer cents. Totals are always worked out on the server from database prices.
7. Dates are `timestamptz`; send ISO 8601 UTC strings.
8. Stripe webhook: raw body on that route only, signature checked, event ID saved to `stripe_events` first, repeat events do nothing.
9. Emails are written to `email_outbox` inside the transaction and sent after commit.
10. No in-memory state between requests (it runs as a Vercel Function). Rate limits and caches live in the database.
11. `/api/jobs/*` requires the `JOBS_SECRET` header.
12. Secrets only from environment variables. Flag any key in code, logs or responses.
13. Logs: no emails, addresses, tokens or card data.
14. Migrations are generated with Drizzle, committed, and only ever move forward.
15. No imports from `web` or any other app folder. This app has its own dependencies.

## Tests to expect

- `app.inject()` tests for every route: success, validation error, not signed in, wrong account, and each business rule failure.
- Database tests run against local Supabase, reset between runs.
- Outside services (Stripe, Google, Resend) are mocked; webhook tests use signed fixture payloads.
- Time-based rules use a fixed clock.

## Useful references

- Business rules: `docs/plan/04-business-rules.md`
- Status maps: `docs/plan/07-status-changes.md`
- Tables: `docs/data-model/entities/`
