# Decision log

Questions raised during planning and how they were answered. Each answer is already built into the rules, diagrams and stages. Bigger ones have an ADR.

## Settled

| Decision | Answer | ADR |
| --- | --- | --- |
| Account types | One account per person. Selling adds a prepper profile. Admin is a yes/no flag. | [0001](../adr/0001-one-account-with-prepper-profile.md) |
| Front end and server | React SPA + separate Fastify server (BFF). No Next.js. | [0002](../adr/0002-react-spa-with-fastify-bff.md) |
| Database access | Drizzle, chosen over Prisma so SQL is learned along the way. Supabase Data API turned off. | [0003](../adr/0003-drizzle-for-database-access.md) |
| Hosting | Vercel for both apps from one repo; Supabase cloud for the database. Free tiers only. | [0004](../adr/0004-vercel-monorepo-hosting.md) |
| Prepper payouts | Stripe Connect, separate charges and transfers, Stripe-hosted onboarding. | [0005](../adr/0005-stripe-connect-separate-charges.md) |
| Status changes | One `transition()` function and a `StatusEvent` log for every status. | [0006](../adr/0006-status-transitions-and-event-log.md) |
| Dates and times | `timestamptz` in UTC, ISO 8601 in the API, Brisbane time on screen. | [0007](../adr/0007-timestamps-utc.md) |
| Feature docs | Written per stage, just before it starts, after a forward check of the code. | [0008](../adr/0008-just-in-time-feature-docs.md) |
| App structure | `web`, `api` and `e2e` are self-contained with their own dependencies. No shared package. The API's OpenAPI spec is the contract. Root holds docs only. | [0009](../adr/0009-self-contained-apps.md) |
| Testing | Critical paths as Playwright + playwright-bdd scenarios with video, in `e2e`. | [0010](../adr/0010-playwright-bdd-critical-paths.md) |
| Delivery | A yes/no plus a radius. No delivery fees. | — |
| Promo codes | In the first version. Made and turned off in the Stripe Dashboard; the API checks the typed code with Stripe, works out the discount and counts uses itself. | [0011](../adr/0011-promo-codes-in-stripe.md) |
| Product images | In the first version. | — |
| Food safety | Extra sign-up step plus admin approval before a prepper can sell. | — |
| Left out | NDIS, delivery fees and scheduling, refunds, buyer–prepper messaging. | — |

## Still open

- [ ] **Who pays for promo discounts?** Suggested: the platform, so preppers always get their full invoice amount. Needed before stage 5.9.
- [ ] **Map line in Notion:** "google map visualisation of …" is cut off. Suggested: "of the prepper's suburb on the prepper page".
