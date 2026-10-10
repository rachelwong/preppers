# Preppers end-to-end tests

Tests that click through the real app in a browser, written as plain-English scenarios and recorded as video.

> Set up in stage 1.7.

## What's in here

- `features/` — one `.feature` file per user journey, in Given / When / Then form. These double as documentation.
- `steps/` — the code behind each step.
- `support/` — helpers to seed test data and read sign-in codes from the local test inbox.

The list of journeys is in [docs/plan/12-testing.md](../../docs/plan/12-testing.md).

## Tools

- Playwright (Chromium)
- playwright-bdd (turns `.feature` files into Playwright tests)

## Running it

This folder has its own dependencies.

1. Start the API and the web app (see their READMEs).
2. Start the Stripe webhook forwarder: `stripe listen --forward-to localhost:<api port>/api/stripe/webhook`.
3. In `e2e`: `pnpm install`, then `pnpm exec playwright install chromium`.
4. `pnpm test:critical` for the critical paths, or `pnpm test` for everything.
5. `pnpm exec playwright show-report` to watch the videos and step through traces.

## Tags

- `@critical` — runs on every pull request, always recorded.
- `@release` — runs nightly, recorded only when it fails.
