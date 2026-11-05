# api rules

1. Every route has zod schemas for params, body, response (they generate `openapi.json`).
2. Errors: `{ code, message, details? }` with correct status. No stack traces.
3. Account and Prepper ID come from the session, never the request.
4. Money is integer cents, totals worked out on the server from DB prices.
5. Multi-table writes run in one transaction.
6. No in-memory state between requests (Vercel Functions).
7. No secrets or personal data in code, logs or responses.
8. Migrations: Drizzle-generated, forward only. Postgres `snake_case`, TS `camelCase`.

Tests: `app.inject()` per route; mock Stripe, Photon, LocationIQ, email.
