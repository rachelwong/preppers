# Preppers API

The server behind the web app: sign-in, business rules, database and outside services.

Checks: `npm test`, `npm run lint` (ESLint and Prettier), `npm run typecheck`. `npm run format` fixes formatting. CI runs all three on every push touching `api/`.

## Running it

From `api`:

1. `npm install`
2. `npm run dev` serves `http://localhost:3000/api/health`.
3. After a route change, `npm run openapi`. Commit `openapi.json` with the change.

## Environment variables

All are secrets: in `.env` locally, in Vercel settings when deployed. Never committed.

| Name | What it is |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres (pooler) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key |
| `SESSION_SECRET` | Signs the session cookie |
| `STRIPE_SECRET_KEY` | Stripe test secret key |
| `STRIPE_WEBHOOK_SECRET` | Checks webhook signatures |
| `LOCATIONIQ_KEY` | Address and place lookups |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | smtp.gmail.com, preppers.au@gmail.com, its app password |
| `SENTRY_DSN` | Sentry project for the API |
| `JOBS_SECRET` | Shared with `pg_cron` to call `/api/jobs/*` |
| `SEED_ADMIN_EMAIL` | Email `db:seed-admin` makes admin (local only) |

## Folder layout (planned)

```text
api/src/
├── build-app.ts   builds the Fastify app (tests, index, openapi)
├── index.ts       Vercel Function entry; `npm run dev`
├── openapi.ts     writes openapi.json
├── errors.ts      ErrorCode, AppError, error handler
├── routes/        route files by feature
├── schemas/       zod schemas (source of openapi.json)
├── services/      business logic, incl. status.ts (transition())
├── db/            Drizzle schema, migrations, seed
├── integrations/  Stripe, Supabase, Photon, LocationIQ, email
└── plugins/       session, rate limits
```

## Admin set-up

**First admin** (stage 1.4): set `SEED_ADMIN_EMAIL` and run `npm run db:seed-admin`.

- No account with that email: creates an `admin`.
- A buyer with no orders, cart items or Prepper profile: changes it to `admin`.
- Anything else: stops and says why.

Then sign in with the email code. For staging, point `DATABASE_URL` at that database for one run (never commit it), or insert the row in the Supabase SQL editor.

**More admins** (stage 7.2): an admin uses Invite admin. The email must not already have an account. Admins can't be removed or deactivated.

Don't change an email in the Supabase dashboard: accounts are matched by email, so it would become a new buyer.

## Email account

App emails and sign-in codes come from **preppers.au@gmail.com**, a Gmail account made for this project.

- Set up at stage 1.5: 2-Step Verification on, then an app password.
- The app password lives only in Supabase's SMTP settings and `SMTP_PASS` on Vercel. Changing the Gmail password cancels it: make a new one and update both.
- Gmail has a daily send cap and codes can land in spam; tell testers.
- Check the inbox now and then for warnings from Google.
- With a custom domain, switch to Resend. No app code changes.

## Deploying

Vercel project `preppers-api`, Root Directory `api`. Fastify runs as one function; Vercel's zero-config entry is `src/index.ts`.
