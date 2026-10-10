# CLAUDE.md — e2e

Read the root `CLAUDE.md` first. This file adds rules for the end-to-end tests.

## Role reminder

- Rachel writes the scenarios and steps. Review them; don't write them unless asked for a snippet.

## Rules to check in review

1. Every critical path in `docs/plan/12-testing.md` has a `.feature` file tagged `@critical`. Release paths are tagged `@release`.
2. Scenarios read as plain English a non-developer could follow. No CSS selectors or code in `.feature` files.
3. Steps find elements by role and label first; `data-testid` only as a last resort.
4. Each scenario sets up its own data through `support/` helpers. No scenario depends on another.
5. No fixed waits (`waitForTimeout`). Wait for a visible result or a status instead.
6. Stripe: test cards only, Payment Element reached through a frame locator, and wait for the webhook to mark the order `paid`.
7. Sign-in codes are read from the local Supabase test inbox, never hard-coded.
8. Video settings: always on for `@critical` with action and test labels; on failure for the rest.
9. No imports from `web` or `api`. This folder has its own dependencies.
10. Reports and traces stay private: CI artifacts only.

## When a stage completes a critical path

- Check the stage adds or updates its scenario, and that the video in the CI report shows the whole journey.
