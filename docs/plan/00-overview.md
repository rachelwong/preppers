# Preppers — build plan overview

- **What:** a marketplace where home cooks (Preppers) sell meal-prep to buyers.
- **Who builds:** Rachel writes the code. Claude plans, writes each stage's feature doc, reviews, and keeps the docs up to date.
- **Who the docs are for:** Rachel, to write code from. They are instructions for a person, not prompts for Claude to generate code.
- **Source of truth:** the [Notion Preppers page](https://app.notion.com/p/rachelwong/Preppers-3e3375d34b348008ac5dc6f1bc3dc7c0).
- **Size:** 9 phases, 53 small stages, one pull request each.

## Phases, in order

| #   | Phase        | Covers                                                                                     |
| --- | ------------ | ------------------------------------------------------------------------------------------ |
| 0   | Foundations  | repo, API basics, database, web shell, error tracking, status changes, docs setup          |
| 1   | Sign-in      | email code, sessions, sign-in screens, guards, staging site, critical path harness         |
| 2   | Prepper      | profile, sign-up form, geocoding, meals, images, food safety step                       |
| 3   | Browsing     | Preppers list, filters, distance search, Prepper page with map, meals list, Home and Meals pages |
| 4   | Cart         | guest cart, cart UI, merge on sign-in                                                      |
| 5   | Checkout     | orders, Stripe payments, payout tracking, webhook, receipts, invoices                        |
| 6   | Buyer extras | profile, reviews, favourites                                                               |
| 7   | Admin        | buyers and Preppers lists, purchases, meals and flagging, verification queue, detail views |
| 8   | Hardening    | scheduled jobs, nightly release suite, rate limits and alerts                              |

Scope for every stage is in [Stages](08-stages.md). The full instructions for a stage are written when you reach it, in [`../features/`](../features/).

## Plan sections

1. [How we work](01-how-we-work.md)
2. [Keeping docs in sync](02-docs-sync.md)
3. [Architecture](03-architecture.md)
4. [Business rules](04-business-rules.md)
5. [Class diagram](05-class-diagram.md)
6. [Data model](06-data-model.md) — one file per table in [`../data-model/entities/`](../data-model/entities/)
7. [Status changes](07-status-changes.md)
8. [Stages](08-stages.md)
9. [Food safety checks](09-food-safety.md)
10. [Not in the first version](10-out-of-scope.md)
11. [Decision log](11-decision-log.md)
12. [Testing](12-testing.md) — critical paths with video
13. [Admin set-up](13-admin-setup.md) — first admin, adding admins
14. [Screens](14-screens.md) — wireframes for every screen
15. [Authentication](15-authentication.md) — session, guards, protected routes
