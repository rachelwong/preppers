# 0010 — Critical paths as Playwright scenarios with video

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

The trial should document and test the key user journeys, with video, using free tools only.

## Options

1. Playwright + playwright-bdd — free, open source; plain-English `.feature` files; built-in video with on-screen action labels; trace viewer.
2. Cypress + Cypress Cloud — video and Test Replay; free cloud tier capped at 500 results a month.
3. Checkly Hobby — good for watching the live site; no video or traces on the free tier.

## Decision

Option 1, in its own self-contained `e2e`. `@critical` scenarios run on every PR with video on; `@release` scenarios run nightly with video on failure. Reports are private GitHub Actions artifacts.

## Consequences

- The `.feature` files are the documentation of each critical path.
- Each stage that completes a critical path adds its scenario.
- CI needs local Supabase, both apps and the Stripe CLI running.
- Checkly can be added later to watch the live site.
- Stages: 1.7, then 2.8, 3.2, 3.3, 4.3, 5.4–5.9, 6.2, 7.2, 7.4, 7.5, 8.2.
