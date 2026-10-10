# CLAUDE.md — web

Read the root `CLAUDE.md` first. This file adds rules for the web app only.

## Role reminder

- Rachel writes the code. Review and explain; don't write app code unless asked for a snippet.

## Rules to check in review

1. All server calls go through the one API client in `src/api/`. No `fetch` elsewhere.
2. TanStack Query keys come from `src/api/queryKeys.ts`. No inline key arrays.
3. Server data lives in TanStack Query only. No copying it into component state or a global store.
4. Signed-in state comes from the `useMe()` query. Never read or store auth tokens.
5. API request and response types come from `src/api/schema.d.ts`, generated from the API's `openapi.json` with `pnpm gen:api`. Never hand-write them. Forms use React Hook Form with zod schemas in `src/schemas/` that match those types.
6. Filters and search terms live in the URL (TanStack Router search params) so refresh and back work.
7. Money: show with the one formatter in `src/lib/money.ts`; never do maths on prices in the browser for anything that gets sent to the server.
8. Dates: show in `Australia/Brisbane` with the formatter in `src/lib/dates.ts`.
9. Hiding a button is cosmetic. The API must also block the action; check the matching API route exists.
10. Optimistic updates must roll back on error, and match the shape the server returns.
11. Only `VITE_` public keys here. Flag any secret.
12. No imports from `api` or any other app folder. This app has its own dependencies.
13. Add `data-testid` only where a role or label can't identify an element; end-to-end tests find things by role and label first.
14. UI is built from shadcn/ui components in `src/components/ui/`, styled with Tailwind and the theme variables. Add components with the shadcn CLI; don't hand-roll an equivalent.
15. Accessibility: labels on every input, keyboard reachable actions, visible focus.

## Tests to expect

- Component tests with Testing Library and MSW for each page state: loading, empty, error, success.
- Form validation messages for each rule.
- One rollback test for each optimistic update.

## Before a UI stage

- Ask whether a wireframe exists (Claude design or Miro). If not, suggest making one before the feature doc.
