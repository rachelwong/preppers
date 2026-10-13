# Preppers API

The server behind the web app. It handles sign-in, applies the business rules, and talks to the database and outside services.

> Commands and setup are filled in at stage 0.2.

## What's in here

- All routes under `/api`.
- Session cookies: the browser never sees Supabase tokens.
- Every database query, through Drizzle.
- Stripe payments, payouts and the webhook.
- Google Geocoding, Resend email, Supabase Storage upload links (photos and licence files).
- `/api/jobs/*` routes that Supabase `pg_cron` calls on a schedule.

## Tools

- Node, Fastify, TypeScript
- Drizzle with Supabase Postgres (PostGIS for distance search)
- Supabase Auth and Storage
- Stripe, Resend, Google Geocoding
- pino for logs, Sentry for errors
- Vitest with Fastify `inject` for tests
- zod route schemas → OpenAPI spec (`openapi.json`)

## Running it

This app has its own dependencies. Run everything from `api`.

1. `pnpm install`
2. Copy `.env.example` to `.env` and fill in the values.
3. `pnpm db:reset` to start local Supabase and seed it.
4. `pnpm db:seed-admin` to make your own email an admin (see [Admin set-up](../docs/plan/13-admin-setup.md)).
5. `pnpm dev`
6. After changing a route, run `pnpm openapi` and commit `openapi.json`. The web app builds its types from it.

## Environment variables

| Name                        | What it is                                  |
| --------------------------- | ------------------------------------------- |
| `DATABASE_URL`              | Supabase Postgres connection (pooler)       |
| `SUPABASE_URL`              | Supabase project URL                        |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key                             |
| `SESSION_SECRET`            | Signs the session cookie                    |
| `STRIPE_SECRET_KEY`         | Stripe test secret key                      |
| `STRIPE_WEBHOOK_SECRET`     | Checks webhook signatures                   |
| `GOOGLE_GEOCODING_KEY`      | Maps key locked to Geocoding                |
| `RESEND_API_KEY`            | Email sending                               |
| `SENTRY_DSN`                | Sentry project for the API                  |
| `JOBS_SECRET`               | Shared with `pg_cron` to call `/api/jobs/*` |
| `SEED_ADMIN_EMAIL`          | Email that `pnpm db:seed-admin` makes admin (local use only) |

All of these are secrets. They live in `.env` locally and in Vercel settings when deployed. Never commit them.

## Folder layout (planned)

```text
api/src/
├── app.ts         builds the Fastify app (used by tests and Vercel)
├── routes/        route files grouped by feature
├── db/            Drizzle schema, migrations, seed
├── schemas/       zod schemas for every route (source of openapi.json)
├── services/      business logic: checkout, status.ts (transition())
├── integrations/  Stripe, Supabase, Google, Resend clients
└── plugins/       session, errors, request ID, rate limits
```

## Deploying

Vercel project `preppers-api`, Root Directory `api`. Vercel runs the Fastify app as one function.
