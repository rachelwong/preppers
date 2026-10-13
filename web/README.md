# Preppers web app

The React app that buyers, Preppers and admins use in the browser.

> Commands and setup are filled in at stage 0.4.

## What's in here

- Pages for browsing, cart, checkout, the Prepper dashboard and the admin area.
- One API client that talks to `/api` on the same site.
- No secret keys. The only keys here are public ones: the Stripe publishable key and the Google Maps browser key.

## Tools

- React, Vite, TypeScript
- Tailwind CSS and shadcn/ui (base design system, see below)
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

## Look and feel

- shadcn/ui is the base design system, with Tailwind CSS.
- Its components are copied into `src/components/ui/`, so they are our code and we can change them.
- They are built on Radix, which handles keyboard use and screen readers.
- Add one with the CLI, for example `pnpm dlx shadcn@latest add button`. Set-up steps: [shadcn/ui with Vite](https://ui.shadcn.com/docs/installation/vite).
- Colours, spacing and corner radius are CSS variables in one place. Change them there, not component by component.
- Forms use React Hook Form; lists use TanStack Table.

## How the app talks to the API

- Every call to the server is a function in `src/api/`. Components never write `fetch` themselves.
- Which endpoints exist is decided by the API, not by this folder. The API lists them in `openapi.json`, and `pnpm gen:api` turns that list into types in `src/api/schema.d.ts`.
- The one client handles the `/api` path, the session cookie, the `{ code, message, details }` error shape and 401 responses, so none of that is repeated.
- To use a new endpoint: the API adds it, run `pnpm openapi` there and `pnpm gen:api` here, then add a function for it in `src/api/`.

## Server data and TanStack Query

- TanStack Query fetches server data and keeps it in a cache in memory. Components read from that cache.
- Don't copy that data into component state or your own store. A copy goes stale: after a cart edit the cache is refreshed, but your copy isn't.
- It also gives loading and error states, refetching when you return to the tab, and a way to refresh data after a change.
- Signed in, left, came back: the session is a cookie the browser keeps, not data in the page. When you reload or open a new tab, the cache starts empty, `useMe()` asks the API who you are, the cookie goes with that request, and you are signed in again. The cart and orders are fetched again the same way.
- If the session has run out, the API answers 401 and the app shows you as signed out.
- Things that only concern the screen (an open menu, a half-typed form) stay in component state. Filters and search terms live in the URL.

## Who is signed in? `useMe()`

- `useMe()` is a small hook that calls `GET /me` through TanStack Query.
- It returns the signed-in account (name, whether it's a buyer or an admin, and Prepper profile status), or says nobody is signed in.
- Any component that needs to know who is using the app calls it. The request is shared, so it isn't repeated.
- It decides which pages and menu items to show. Hiding a button is only cosmetic: the API still refuses anything the person isn't allowed to do.
- The browser never reads or stores auth tokens. The cookie is set by the API and JavaScript can't see it.

## Folder layout (planned)

```text
web/src/
├── routes/        one file per page (TanStack Router)
├── features/      UI grouped by feature: cart, products, checkout…
├── components/    shared UI pieces
│   └── ui/        shadcn/ui components (copied in by the shadcn CLI)
├── api/           the API client, query keys, generated schema types
├── schemas/       zod schemas for forms
└── lib/           formatting (money, dates) and helpers
```

## Deploying

Vercel project `preppers-web`, Root Directory `web`. It forwards `/api/*` to the `preppers-api` project, so the browser sees one site.
