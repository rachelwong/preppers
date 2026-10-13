# Stages

Each stage lists what to **build**, how you know it's **done**, what Claude will **check** in review, and the official **docs** to read first.

- These lines are the scope, not the full instructions. When you reach a stage, Claude writes its feature doc in `docs/features/` (see [How we work](01-how-we-work.md)).
- Tick a stage when its PR is merged and its doc updates are approved.
- Stage 3.3 already has a worked "How" list as an example of the detail a feature doc gives.

## Phase 0 — Foundations

- [ ] **Repo setup** (0.1)
  - Build: `web` and `api` as separate projects, each with its own `package.json`, lockfile, strict TypeScript, ESLint, Prettier and Vitest. One GitHub Actions workflow per app, triggered by changes in its folder.
  - Done: a sample test passes in CI for each app.
  - Check: no root `package.json`; no imports across app folders; no app code yet.
  - Docs: [Build and test Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs), [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Use secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [ ] **API basics** (0.2)
  - Build: Fastify app, `/health`, zod validation, one error format, logging with request IDs.
  - Done: tests for 200, 400, 404, 409 and 500 responses.
  - Check: no stack traces leak; app can be tested without starting a server, and runs both locally and as a Vercel Function.
  - Docs: [Fastify testing](https://fastify.dev/docs/latest/Guides/Testing/)
- [ ] **Database setup** (0.3)
  - Build: local Supabase, Drizzle, `accounts` table with status, seed and reset scripts.
  - Done: `pnpm db:reset` rebuilds the database; one test hits it.
  - Check: migrations committed; no secret keys in the web app.
  - Docs: [Supabase local development](https://supabase.com/docs/guides/local-development), [Drizzle on Supabase](https://supabase.com/docs/guides/database/drizzle), [Drizzle get started](https://orm.drizzle.team/docs/get-started/supabase-new), [Drizzle migrations](https://orm.drizzle.team/docs/kit-overview), [Row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [ ] **Web shell** (0.4)
  - Build: Vite + React, TanStack Router and Query, Tailwind CSS and shadcn/ui, layout, one typed API client.
  - Done: home page shows `/health`; error state tested.
  - Check: one fetch wrapper; query keys in one place.
- [ ] **Error tracking** (0.5)
  - Build: Sentry on web and server, shared request ID, source maps.
  - Done: a test error appears in Sentry with matching IDs on both sides.
  - Check: personal data scrubbed; Sentry off in tests.
  - Docs: [Sentry for Fastify](https://docs.sentry.io/platforms/javascript/guides/fastify/), [Sentry for React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [ ] **Status changes** (0.6)
  - Build: `status_events` table, allowed-move lists, `transition()` function.
  - Done: allowed move saves status and event together; bad move returns 409 and saves nothing.
  - Check: nothing else writes a status directly.
- [ ] **Docs setup** (0.7)
  - Build: `CLAUDE.md`, ADRs, plan and templates are already drafted in this folder; review them and commit. Add a `doc-sync` skill for Claude Code.
  - Done: the skill turns a sample diff into proposals with old text, new text and proof.
  - Check: the skill never writes without approval.

## Phase 1 — Sign-in

- [ ] **Email code sign-in** (1.1)
  - Build: request and verify routes via Supabase Auth; create an `active` account on first sign-in; secure session cookie.
  - Done: test runs the full flow using the local test inbox.
  - Check: tokens never sent to the browser; account created only once; an existing account with the same email is used, not duplicated.
  - Docs: [Email OTP sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [ ] **Sessions** (1.2)
  - Build: `/me`, logout, cookie check with token refresh, origin check, block deactivated accounts.
  - Done: tests for valid, refreshed, revoked, missing and deactivated sessions.
  - Check: correct use of 401 vs 403.
  - Docs: [Server-side auth](https://supabase.com/docs/guides/auth/server-side)
- [ ] **Sign-in screens** (1.3)
  - Build: email step, code step, About you step on first sign-in (name and optional dietary needs; Google fills the name), protected pages, sign-out. See wireframe W6 in [Screens](14-screens.md).
  - Done: all three steps and the redirect tested; About you shows only once.
  - Check: sign-in state only lives in TanStack Query.
- [ ] **Permission checks** (1.4)
  - Build: admin, buyer, Prepper and verified-Prepper guards; `pnpm db:seed-admin` script that makes the first admin from `SEED_ADMIN_EMAIL` (see [Admin set-up](13-admin-setup.md)).
  - Done: each guard tested.
  - Check: checks happen on the server, not just in the UI; admins are refused on cart, checkout and Prepper profile routes.
- [ ] **Google sign-in** (1.5)
  - Build: server-side Google login, same session cookie.
  - Done: works on staging; error paths tested.
  - Check: links correctly to an existing account with the same email.
  - Docs: [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google), [Server-side auth](https://supabase.com/docs/guides/auth/server-side)
- [ ] **Staging site** (1.6)
  - Build: deploy web and api as two Vercel projects from this repo, forward /api from web to api, and deploy the database to Supabase.
  - Done: sign-in works end to end on staging.
  - Check: cookie and CORS settings; secrets only in hosting settings.
  - Docs: [Fastify on Vercel](https://vercel.com/docs/frameworks/backend/fastify), [Vercel environment variables](https://vercel.com/docs/environment-variables), [Scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) for the weekly Supabase ping

- [ ] **Critical path harness** (1.7)
  - Build: `e2e` as its own project with Playwright and playwright-bdd; video on for `@critical` with action labels; helper that reads sign-in codes from the local test inbox; CI job that starts Supabase, api and web, runs `@critical` and uploads the report.
  - Done: `sign-in-out.feature` (C1) passes in CI and its video shows sign in, the account name, sign out, and the redirect away from an account page.
  - Check: no fixed waits; elements found by role and label; report kept as a private artifact.
  - Docs: [Playwright videos](https://playwright.dev/docs/videos), [Playwright in CI](https://playwright.dev/docs/ci-intro), [playwright-bdd](https://vitalets.github.io/playwright-bdd/), [Testing plan](12-testing.md)

## Phase 2 — Preppers

- [ ] **Prepper profile API** (2.1)
  - Build: `prepper_profiles` table; create and update own profile; starts as `draft`.
  - Done: create, update, validation and one-per-account tested.
  - Check: structured address; enums come from the API's zod schemas.
- [ ] **Sign-up form** (2.2)
  - Build: multi-step form — contact, kitchen location, cuisines and delivery, review; saves progress.
  - Done: step validation, back and next, and submit tested.
  - Check: each field belongs to one step.
- [ ] **Address to map position** (2.3)
  - Build: look up lat/lng with Google when the address changes.
  - Done: tested with Google mocked; clear error when no match.
  - Check: API key stays on the server.
  - Docs: [Geocoding API](https://developers.google.com/maps/documentation/geocoding), [API key security](https://developers.google.com/maps/api-security-best-practices)
- [ ] **Add and list products** (2.4)
  - Build: `products` table; create and list own products.
  - Done: prices in cents; Preppers only see their own.
  - Check: Prepper ID taken from the session, never the request.
- [ ] **Edit and hide products** (2.5)
  - Build: edit route; hide, show and archive using `transition()`.
  - Done: editing someone else's product returns 403; bad moves return 409.
  - Check: Prepper can't flag their own products.
- [ ] **Product screens** (2.6)
  - Build: product table, create and edit form, status buttons.
  - Done: table states and form validation tested.
  - Check: lists refresh after changes; one price formatter.
- [ ] **Product image upload** (2.7)
  - Build: public storage bucket; signed upload link; jpeg/png/webp up to 2 MB.
  - Done: wrong type, too big, and other people's products are rejected.
  - Check: browser never sees the storage secret key.
  - Docs: [Signed upload URLs](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl)
- [ ] **Image picker** (2.8)
  - Build: upload with preview, progress and replace; photos on product cards.
  - Done: preview and failed upload tested.
  - Check: no page jump while images load.
  - Critical path: add release scenario R3 (product lifecycle).
- [ ] **Food safety step** (2.9)
  - Build: new sign-up step (see Food safety checks); licence file to a private bucket; moves to `pending_review`.
  - Done: validation, expired dates rejected, status change recorded.
  - Check: only admins can move it further.
  - Docs: [Signed upload URLs](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl)

## Phase 3 — Browsing

- [ ] **Preppers list API** (3.1)
  - Build: list with cuisine and dietary filters and paging; verified Prepper and active products only.
  - Done: each filter and page edge tested.
  - Check: database indexes; no repeated queries per row.
- [ ] **Browse screen** (3.2)
  - Build: Prepper cards; filters saved in the URL.
  - Done: changing a filter updates the URL and results.
  - Check: filters survive refresh and the back button.
  - Critical path: add release scenario R1 (browse and filter).
- [ ] **Distance filter** (3.3)
  - Build: "near me" radius search and "delivers to me".
  - How:
    1.  One search box takes a suburb or a postcode. A "Use my location" button uses the browser's location instead, with permission.
    2.  The server turns the suburb or postcode into lat/lng with Google Geocoding, limited to Australia, and caches the answer in a `place_lookups` table to save free calls.
    3.  Prepper locations are stored as a PostGIS `geography` point with a GiST index (added to `prepper_profiles` in this stage).
    4.  "Near me": radius choices of 5, 10, 25 or 50 km, using `ST_DWithin` from the buyer's point.
    5.  "Delivers to me": `canDeliver` is true and the buyer is inside that Prepper's own `deliveryRadiusKm`.
    6.  Results are sorted by distance and show it rounded to the nearest km. Prepper coordinates are never sent to the browser.
    7.  Route: `GET /preppers?location=4000&radiusKm=10&deliversToMe=true`; the search is kept in the URL.
    8.  No map in this stage. The map pin arrives in 3.4.
  - Docs: [PostGIS on Supabase](https://supabase.com/docs/guides/database/extensions/postgis), [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
  - Done: tested with Preppers at known distances.
  - Check: the database does the distance maths.
  - Critical path: add release scenario R2 (distance and delivers to me).
- [ ] **Prepper page and map** (3.4)
  - Build: Prepper details, products, map pin at suburb level.
  - Done: unknown or unverified Prepper return 404.
  - Check: exact address never shown.
  - Docs: [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript), [API key security](https://developers.google.com/maps/api-security-best-practices)
- [ ] **Meals list API** (3.5)
  - Build: `GET /products` with search, dietary, cuisine, max price, distance from a postcode, "delivers to me", featured, sort (newest, price, distance) and paging of 12. Only active meals from verified Preppers with payouts on. Reuses the 3.3 distance query.
  - Done: each filter, sort and page edge tested; hidden, flagged and archived meals never returned.
  - Check: database indexes; Prepper coordinates never sent to the browser.
- [ ] **Home and Meals pages** (3.6)
  - Build: Home (W1) with postcode search, featured meals (4 most recently featured) and newest meals (4); Meals page (W2) with filters, sort and pages, all kept in the URL. See [Screens](14-screens.md).
  - Done: postcode search lands on Meals with the location set; empty results show Clear filters.
  - Check: filters survive refresh and the back button; the featured row hides when nothing is featured.

## Phase 4 — Cart

- [ ] **Guest cart API** (4.1)
  - Build: `carts` and `cart_items`; guest cookie; add, change quantity, remove; every edit changes the cart's `updatedAt`; subtotal worked out on read.
  - Done: guest cart flow tested; inactive products rejected; no edits during checkout.
  - Check: prices always read from the database, never from the browser.
- [ ] **Cart screen** (4.2)
  - Build: add buttons; cart drawer grouped by Prepper; instant quantity changes that undo on error.
  - Done: undo on a failed change tested.
  - Check: instant update matches what the server returns.
- [ ] **Merge on sign-in** (4.3)
  - Build: move the guest cart into the account cart; guest cart becomes `merged`.
  - Done: empty, full and overlapping carts tested.
  - Check: runs once, in one transaction.

  - Critical path: add `@critical` scenario C2 (guest cart merge).

## Phase 5 — Checkout

- [ ] **Orders without Stripe** (5.1)
  - Build: `orders`, `prepper_invoices`, `order_lines`; checkout makes a `pending_payment` order with price snapshots; cart becomes `checking_out`; editing the cart cancels the order.
  - Done: a two-Prepper cart makes 1 order and 2 invoices with correct totals; cancel puts the cart back.
  - Check: one transaction; totals worked out on the server.
- [ ] **Prepper payouts setup** (5.2)
  - Build: Stripe Connect account and onboarding link for each Prepper.
  - Done: test onboarding completes; Preppers without payouts can't be bought from.
  - Check: payout status read from Stripe, not guessed.
  - Docs: [Build your Connect integration](https://docs.stripe.com/connect/interactive-platform-guide) (start here; Stripe treats the older Express setup as legacy), [Stripe-hosted onboarding](https://docs.stripe.com/connect/hosted-onboarding), [Connect testing](https://docs.stripe.com/connect/testing)
- [ ] **Start a payment** (5.3)
  - Build: create a Stripe payment and a `payments` row at checkout; return only the client secret.
  - Done: repeat calls reuse the same payment.
  - Check: amount comes from the order, never the browser.
  - Docs: [Separate charges and transfers](https://docs.stripe.com/connect/separate-charges-and-transfers), [Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [ ] **Checkout screen** (5.4)
  - Build: Stripe Payment Element; success page that waits for the order to be paid; failure page.
  - Done: normal and 3DS test cards work on staging.
  - Check: the success page never changes any status.
  - Docs: [Payment Element](https://docs.stripe.com/payments/payment-element), [Test cards](https://docs.stripe.com/testing)
  - Critical path: add release scenario R4 (3DS card).
- [ ] **Stripe webhook** (5.5)
  - Build: verified webhook route; ignore repeated events; on success, update payment, order, invoices and cart and queue payouts; on failure, update payment and cancel when final.
  - Done: each event type tested; a repeated event changes nothing.
  - Check: one transaction per event; failures sent to Sentry.
  - Docs: [Webhooks](https://docs.stripe.com/webhooks), [Stripe CLI](https://docs.stripe.com/cli/install), [Separate charges and transfers](https://docs.stripe.com/connect/separate-charges-and-transfers)
  - Critical path: add release scenarios R5 (declined then retry) and R6 (cart edit cancels order).
- [ ] **Buyer receipts** (5.6)
  - Build: list and view own orders, grouped by Prepper.
  - Done: only own orders; snapshot prices shown.
  - Check: reads snapshots, not live products.
  - Critical path: add `@critical` scenario C3 (checkout from two Preppers, one receipt).
- [ ] **Prepper invoices** (5.7)
  - Build: list own invoices; mark `handed_over`; order becomes `completed` when the last one is handed over.
  - Done: only own invoices; bad moves return 409.
  - Check: both updates in one transaction.
  - Critical path: add `@critical` scenario C4 (Prepper hands over, order completed).

## Phase 6 — Buyer extras

- [ ] **Buyer profile** (6.1)
  - Build: name, suburb, dietary needs; browse starts with saved dietary filters.
  - Done: update tested; saved filters can be removed.
  - Check: same dietary list as products.
- [ ] **Reviews** (6.2)
  - Build: review a product you've paid for, once; show averages.
  - Done: non-buyers and repeat reviews rejected.
  - Check: eligibility checked through the order line.
  - Critical path: add release scenario R7 (reviews).
- [ ] **Favourites** (6.3)
  - Build: favourite Preppers and products; favourites page.
  - Done: toggling twice is safe; only own favourites shown.
  - Check: instant toggle in the UI.

## Phase 7 — Admin

- [ ] **Accounts list** (7.1)
  - Build: Preppers and Buyers tables (a buyer has no Prepper profile) with search, status (including deactivated), created date, sorting and paging, all done on the server. See W14 in [Screens](14-screens.md).
  - Done: admin only; bad parameters rejected.
  - Check: only allowed sort columns.
- [ ] **Manage accounts** (7.2)
  - Build: invite an admin (name and email), edit, deactivate and reactivate buyer and Prepper accounts; log every admin action.
  - Done: each action tested and logged.
  - Check: admin accounts can't be deactivated; owners can't deactivate their own account; inviting an email that already has an account fails with 409; nothing is deleted.
  - Critical path: add release scenario R9 (deactivated account can't sign in).
- [ ] **Purchases list** (7.3)
  - Build: orders filtered by date, status and Prepper.
  - Done: each filter tested.
  - Check: stored in UTC, shown in Brisbane time.
- [ ] **Flag products** (7.4)
  - Build: meals table with search, status, featured and created filters; flag with a reason, unflag, email the Prepper; feature and unfeature (sets `featuredAt`).
  - Done: flagged products disappear from browse; email queued.
  - Check: email sent only after the save succeeds.
  - Docs: [Resend with Node.js](https://resend.com/docs/send-with-nodejs)
  - Critical path: add release scenario R8 (flagged meal leaves browse).
- [ ] **Prepper checks queue** (7.5)
  - Build: list of `pending_review` Preppers; view licence file; approve or reject with reason; email the result.
  - Done: approve makes the Prepper public; reject needs a reason.
  - Check: file links expire quickly.
  - Docs: [Resend with Node.js](https://resend.com/docs/send-with-nodejs)
  - Critical path: add `@critical` scenario C5 (Prepper approved, appears in browse).
- [ ] **Detail views** (7.6)
  - Build: meal, buyer and Prepper detail pages, opened by clicking a row in the lists (W13, W15 in [Screens](14-screens.md)). Meals: flag, unflag, feature. Buyers and Preppers: deactivate with a reason, reactivate. Pending Preppers: licence file, approve, reject with a reason.
  - Done: each page and action tested; admin accounts never show deactivate.
  - Check: admin only; every action logged; emails sent only after the save.

## Phase 8 — Hardening

- [ ] **Scheduled jobs** (8.1)
  - Build: abandon guest carts 1 hour after their last edit (job runs every 5 minutes); cancel unpaid orders after 24 hours; retry failed payouts. Run them with Supabase `pg_cron`.
  - Done: tested with a fixed clock; safe to run twice.
  - Check: every change goes through `transition()`.
  - Docs: [Supabase Cron](https://supabase.com/docs/guides/cron)
- [ ] **Nightly release suite** (8.2)
  - Build: nightly GitHub Actions schedule running all `@critical` and `@release` scenarios; one recorded manual run of Stripe payout onboarding; check every path in the testing plan has a scenario.
  - Done: a full nightly run passes; the report has a video for every critical path and for any failure.
  - Check: stable selectors; no scenario depends on another; no secrets in videos or traces.
  - Docs: [Playwright in CI](https://playwright.dev/docs/ci-intro), [Testing plan](12-testing.md)
- [ ] **Limits and alerts** (8.3)
  - Build: rate limits on sign-in and checkout (stored in the database, plus Vercel Firewall rules), security headers, size limits; Sentry alerts for webhook failures and error spikes.
  - Done: limits return 429; a forced webhook failure triggers an alert.
  - Check: no personal data in logs.
  - Docs: [Vercel Firewall](https://vercel.com/docs/vercel-firewall)
