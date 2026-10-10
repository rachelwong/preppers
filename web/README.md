# Preppers web app

The React app that buyers, Prepperss and admins use in the browser.

> Commands and setup are filled in at stage 0.4.

## What's in here

- Pages for browsing, cart, checkout, the Preppers dashboard and the admin area.
- One API client that talks to `/api` on the same site.
- No secret keys. The only keys here are public ones: the Stripe publishable key and the Google Maps browser key.

## Tools

- React, Vite, TypeScript
- TanStack Router (pages and URL search params), Query (server data), Table (lists)
- React Hook Form + zod
- openapi-typescript: API types generated from the API's OpenAPI spec
- Stripe Payment Element, Google Maps JavaScript API
- Vitest, Testing Library, MSW (end-to-end tests live in `e2e`)
- Sentry for errors

## Running it

This app has its own dependencies. Run everything from `web`.

1. `pnpm install`
2. Copy `.env.example` to `.env` and fill in the values.
3. Start the API in another terminal (see `api/README.md`).
4. `pnpm dev`
5. After an API change, run `pnpm gen:api` to refresh the API types.

## Environment variables

| Name                           | What it is                     |
| ------------------------------ | ------------------------------ |
| `VITE_STRIPE_PUBLISHABLE_KEY`  | Stripe test publishable key    |
| `VITE_GOOGLE_MAPS_BROWSER_KEY` | Maps key locked to your domain |
| `VITE_SENTRY_DSN`              | Sentry project for the web app |

`VITE_` values end up in the browser. Never put a secret in one.

## Folder layout (planned)

```text
web/src/
├── routes/        one file per page (TanStack Router)
├── features/      UI grouped by feature: cart, products, checkout…
├── components/    shared UI pieces
├── api/           the API client, query keys, generated schema types
├── schemas/       zod schemas for forms
└── lib/           formatting (money, dates) and helpers
```

## Deploying

Vercel project `Preppers-web`, Root Directory `web`. It forwards `/api/*` to the `Preppers-api` project, so the browser sees one site.
