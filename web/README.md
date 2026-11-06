# Preppers web app

The React app that buyers, Preppers and admins use.

Checks: `npm test`, `npm run lint` (ESLint and Prettier), `npm run typecheck`. `npm run format` fixes formatting. CI runs all three on every push touching `web/`.

## Running it

From `web`: `npm install`.

## Environment variables

`VITE_` values end up in the browser. Never put a secret in one.

| Name | What it is |
| --- | --- |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe test publishable key |
| `VITE_SENTRY_DSN` | Sentry project for the web app |

The map (Leaflet with OpenStreetMap tiles) needs no key.

## How it fits together

- **API calls:** every call is a function in `src/api/`, using one client that handles `/api`, the cookie, the `{ code, message, details }` error shape and 401s. Types come from `src/api/schema.d.ts`, generated from the API's `openapi.json`.
- **Server data:** lives only in TanStack Query's cache. Copying it into component state goes stale.
- **Screen-only state** (an open menu, a half-typed form) stays in components. Filters and search live in the URL.
- **Who's signed in:** `useMe()` reads `GET /api/me` through TanStack Query. The session is an httpOnly cookie, so a reload just asks `/me` again. Hiding a button is cosmetic; the API still refuses. See [auth.md](../docs/auth.md).
- **UI:** shadcn/ui components in `src/components/ui/` (our code, built on Radix). Theme colours, spacing and radius are CSS variables in one place. Add one with `npx shadcn@latest add button`.

## Folder layout (planned)

```text
web/src/
├── routes/        one file per page (TanStack Router)
├── features/      UI by feature: cart, meals, checkout…
├── components/ui/ shadcn/ui components
├── hooks/         TanStack Query hooks; only callers of src/api
├── api/           API client, query keys, generated types
├── schemas/       zod form schemas
└── lib/           money and date formatting
```

## Deploying

Vercel project `preppers-web`, Root Directory `web`. It forwards `/api/*` to `preppers-api`, so the browser sees one site.
