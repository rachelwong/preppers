# Stages

Each stage lists what to **build**, how you know it's **done**, what review **checks**, the **screen** and official **docs**. These lines are the scope; Claude plans the detail when the stage starts (see [CLAUDE.md](../CLAUDE.md)). Wireframes: the [board](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6) is the only source; W-numbers link to it. Who can open each screen: [auth.md](auth.md#web-routes).

- One feature per stage. Diff under about 300 lines, not counting lockfiles and generated files.
- API first, then the screen that uses it.
- Ideas found mid-stage become a new stage.
- Tick a stage once Rachel has committed it.

## Phase 0 — Foundations

- [x] **Repo setup** (0.1)
  - Build: `web` and `api` as separate npm projects, each with its own `package.json`, lockfile, strict TypeScript, ESLint, Prettier and Vitest. One GitHub Actions workflow per app, triggered by changes in its folder.
  - Build: ESLint rules for [AGENTS.md](../AGENTS.md): `curly: all`, `no-magic-numbers` (allow -1, 0, 1; ignore array indexes and default values; off in tests), `no-nested-ternary`, `id-length` (max 30), `padding-line-between-statements`, and `eslint-plugin-boundaries` for the layers. HTTP statuses from `http-status-codes` in both apps.
  - Done: a sample test passes in CI for each app; the lint hook lints each file Claude edits.
  - Check: no root `package.json`; no imports across apps.
  - Docs: [Build and test Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs), [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [ ] **API basics** (0.2)
  - Build: Fastify app, `/health`, zod validation, one error format, logging with request IDs.
  - Done: tests for 200, 400, 404, 409 and 500; one test drives the app the Vercel Function exports.
  - Check: no stack traces leak; testable without a server; runs locally and as a Vercel Function.
  - Docs: [Fastify testing](https://fastify.dev/docs/latest/Guides/Testing/)
- [ ] **Database setup** (0.3)
  - Before: Claude prompts Rachel to install, then checks `docker info` and `supabase --version`.
    1. `brew install --cask docker-desktop`; open once, accept licence and helper.
    2. Settings → Resources: memory 4–6 GB, 4 CPUs. General: start at login off.
    3. `brew install supabase/tap/supabase`.
  - Build: local Supabase, Drizzle, `accounts` table, seed and reset scripts.
  - Done: `npm run db:reset` rebuilds the database; one test hits it.
  - Check: migrations committed; no secret keys in web.
  - Docs: [Supabase local development](https://supabase.com/docs/guides/local-development), [Drizzle on Supabase](https://supabase.com/docs/guides/database/drizzle), [Drizzle migrations](https://orm.drizzle.team/docs/kit-overview), [Row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [ ] **Web shell** (0.4)
  - Build: Vite + React, TanStack Router and Query, Tailwind and shadcn/ui, layout, one typed API client (`openapi-fetch` on the generated schema).
  - Done: home page shows `/health`; error state tested.
  - Check: one fetch wrapper; query keys in one place.
- [ ] **Error tracking** (0.5)
  - Build: Sentry on web and api, shared request ID, source maps.
  - Done: a test error appears in Sentry with matching IDs on both sides.
  - Check: personal data scrubbed; Sentry off in tests.
  - Docs: [Sentry for Fastify](https://docs.sentry.io/platforms/javascript/guides/fastify/), [Sentry for React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [ ] **Status changes** (0.6)
  - Build: `status_events` table, allowed-move map, `transition()`.
  - Done: an allowed move saves status and event together; a bad move returns 409 and saves nothing.
  - Check: nothing else writes a status.

## Phase 1 — Sign-in

- [ ] **Email code sign-in** (1.1)
  - Build: send and verify routes via Supabase Auth; create an `active` buyer on first sign-in; secure session cookie; an empty `afterSignIn` step in verify, filled in 4.3.
  - Done: full flow tested with the local test inbox.
  - Check: tokens never reach the browser; an existing email reuses its account.
  - Docs: [Email OTP sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [ ] **Sessions** (1.2)
  - Build: `authenticate` hook, `/me` (`prepperProfile: null` until 2.1), logout, origin check, deactivated accounts blocked, sign-in limits in the database. See [auth.md](auth.md).
  - Done: valid, refreshed, revoked, missing and deactivated sessions tested; limits return 429 and reset.
  - Check: 401 vs 403 correct; no `getUser()` per request; asymmetric JWT signing keys on in Supabase.
  - Docs: [Server-side auth](https://supabase.com/docs/guides/auth/server-side), [getClaims](https://supabase.com/docs/reference/javascript/auth-getclaims)
- [ ] **Sign-in screens** (1.3)
  - Build: email step, code step, About you on first sign-in (name, optional dietary needs), protected pages, sign-out, header per role.
  - Done: all three steps and the redirect tested; About you shows once.
  - Screen: [W6](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Header on every page: Meals, Preppers, cart, Sign in (account menu once signed in); admins get an Admin link and no cart. Code step has Resend and Use another email. Deactivated: "This account has been deactivated" after the code. Admins land on `/admin/meals`.
  - Check: sign-in state only in TanStack Query (`/me`); layout routes per [auth.md](auth.md); `redirect` only accepts same-site paths.
- [ ] **Permission checks** (1.4)
  - Build: admin and buyer guards; `npm run db:seed-admin` ([api/README.md](../api/README.md#admin-set-up)).
  - Done: each guard tested for 401, wrong role 403, deactivated 403, allowed.
  - Check: admins refused on cart, checkout and Prepper routes; one `requireAdmin` on `/api/admin`.
- [ ] **Staging site** (1.5)
  - Build: two Vercel projects, `/api` forwarded from web to api, Supabase cloud. Sign-in emails through preppers.au@gmail.com ([api/README.md](../api/README.md#email-account)): Supabase SMTP settings, Magic Link template showing `{{ .Token }}`, code expiry about 10 minutes. Weekly GitHub Actions ping so Supabase doesn't pause. Scope the Supabase MCP in `.mcp.json` to the new project (`project_ref`).
  - Done: sign-in works on staging with a code sent to an address outside the Supabase team.
  - Check: cookie and CORS settings; secrets only in hosting settings; the email shows a 6-digit code, not a link.
  - Docs: [Fastify on Vercel](https://vercel.com/docs/frameworks/backend/fastify), [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Google app passwords](https://support.google.com/accounts/answer/185833)
- [ ] **Critical path harness** (1.6)
  - Build: `e2e` project with Playwright and playwright-bdd; video for `@critical`; sign-in code helper; CI job running `@critical`.
  - Done: C1 passes in CI with video.
  - Check: no fixed waits; elements found by role and label; report kept private.
  - Docs: [Playwright videos](https://playwright.dev/docs/videos), [playwright-bdd](https://vitalets.github.io/playwright-bdd/), [testing.md](testing.md)

## Phase 2 — Preppers

- [ ] **Prepper profile API** (2.1)
  - Build: `prepper_profiles`; create and update own profile, starting `draft`. Prepper lookup in `authenticate` and `/me`; `requirePrepper`, `requireMealEditor`; `_prepper` layout. Split guards into their own stage if over 300 lines.
  - Done: create, update, validation and one-per-account tested; guards tested.
  - Check: structured address; guards match [auth.md](auth.md).
- [ ] **Sign-up form** (2.2)
  - Build: multi-step form: contact, kitchen location, cuisines and delivery, review; saves progress.
  - Done: step validation, back, next and submit tested.
  - Screen: [W10](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Saved as a draft from the Contact step. At least one cuisine; radius 1–50 km if delivering. After submit: "In review", and meals can be added (hidden).
- [ ] **Address lookup** (2.3)
  - Build: address suggestions on kitchen location through `GET /api/places/addresses`: Photon, then LocationIQ. Save the position with the address. LocationIQ attribution shown.
  - Done: tested with both providers mocked, including fallback and no match.
  - Screen: [W10](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6) kitchen step. Only the suburb is shown publicly.
  - Check: LocationIQ key only on the server; LocationIQ free plan includes autocomplete (else ask Rachel).
  - Docs: [Photon](https://github.com/komoot/photon), [LocationIQ autocomplete](https://docs.locationiq.com/reference/autocomplete)
- [ ] **Add and list meals** (2.4)
  - Build: `meals`; create and list own meals.
  - Done: prices in cents; own meals only; rejected Prepper refused 403.
  - Check: Prepper ID from the session.
- [ ] **Edit and hide meals** (2.5)
  - Build: edit; hide, show and archive through `transition()`.
  - Done: someone else's meal 404; rejected Prepper 403; bad moves 409.
- [ ] **Meal screens** (2.6)
  - Build: meal table, create and edit form, status buttons.
  - Done: table states and form validation tested.
  - Screen: [W12](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Status per meal: Active, Hidden, Flagged, Archived. Flagged: Show and Archive off, reason in the email. Show in browse toggles active and hidden. Archive asks to confirm. Before verified, a note explains why meals don't show. Rejected: read-only.
  - Check: lists refresh after changes; one price formatter.
- [ ] **Meal image upload** (2.7)
  - Build: public bucket; signed upload link; jpeg/png/webp up to 2 MB.
  - Done: wrong type, too big and other people's meals rejected.
  - Docs: [Signed upload URLs](https://supabase.com/docs/reference/javascript/file-buckets-createsigneduploadurl)
- [ ] **Image picker** (2.8)
  - Build: upload with preview, progress and replace; photos on meal cards.
  - Done: preview and failed upload tested.
  - Critical path: R3.
- [ ] **Food safety step** (2.9)
  - Build: new sign-up step ([rules.md](rules.md#preppers-and-food-safety)); licence file to a private bucket; moves to `pending_review`.
  - Done: validation, expired dates rejected, status change recorded.
  - Check: only admins move it further.

## Phase 3 — Browsing

- [ ] **Preppers list API** (3.1)
  - Build: list with cuisine and dietary filters and paging; verified Preppers with active accounts only.
  - Done: each filter and page edge tested.
  - Check: indexes; no query per row.
- [ ] **Browse screen** (3.2)
  - Build: Preppers list; filters in the URL.
  - Done: changing a filter updates the URL and results; survives refresh and back.
  - Screen: [W17](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Card: name, suburb, cuisines, dietary tags, distance, "Delivers" badge, heart. Sort: newest, or distance once a location is set. Pages of 12; a filter change goes to page 1. No results: "No Preppers match" and Clear filters.
  - Critical path: R1.
- [ ] **Distance filter** (3.3)
  - Build: `GET /api/places?q=` turns a suburb or postcode into a position: `geocode_cache`, then Photon, then LocationIQ. "Use my location" from the browser. GiST index on Prepper `location`. "Near me" radius 5, 10, 25 or 50 km with `ST_DWithin`; "delivers to me" uses each Prepper's radius. Sorted by distance, shown to the km. Position kept in the URL.
  - Done: tested with Preppers at known distances; providers mocked; both-fail message shown.
  - Check: the database does the distance maths; coordinates never sent; cache expiry matches provider terms; a few Brisbane postcodes return sensible positions.
  - Docs: [PostGIS on Supabase](https://supabase.com/docs/guides/database/extensions/postgis), [Photon](https://github.com/komoot/photon), [LocationIQ search](https://docs.locationiq.com/reference/search)
  - Critical path: R2.
- [ ] **Prepper page and map** (3.4)
  - Build: Prepper details, meals, suburb-level pin on a Leaflet map with OpenStreetMap tiles.
  - Done: unknown or unverified Prepper 404.
  - Screen: [W4](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Save Prepper; delivery radius shown only if they deliver; their active meals as [W2](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6) cards.
  - Check: exact address never shown; OSM attribution shown.
  - Docs: [Leaflet](https://leafletjs.com/reference.html), [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
- [ ] **Meals list API** (3.5)
  - Build: `GET /meals` with search, dietary, cuisine, max price, distance, "delivers to me", featured, sort (newest, price, distance), pages of 12. Reuses the 3.3 distance query.
  - Done: each filter, sort and page edge tested; hidden, flagged and archived never returned.
- [ ] **Home, Meals and Meal detail pages** (3.6)
  - Build: Home with location search, 4 featured and 4 newest meals; Meals with filters, sort and pages in the URL; Meal detail.
  - Done: search lands on Meals with the location set; empty results show Clear filters.
  - Check: featured row hides when empty.
  - Screen: [W1](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6), [W2](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6), [W3](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Search opens Meals with the location in the URL. Sort: newest (default), price, distance once a location is set. Card: photo, name, price, Prepper, distance, heart. Pages of 12; a filter change goes to page 1; no results: "No meals match". Meal detail: Prepper link, quantity 1–20, Add to cart opens the drawer, Save, reviews newest first; unbuyable shows "Not available right now" (old receipt links still open it).

## Phase 4 — Cart

- [ ] **Guest cart API** (4.1)
  - Build: `carts`, `cart_items`; guest cookie; add, change, remove; subtotal on read from buyable meals only.
  - Done: guest flow; unbuyable meals refused; later-unavailable lines kept but left out; no edits while checking out; `422 own_meal`.
- [ ] **Cart screen** (4.2)
  - Build: add buttons; drawer grouped by Prepper; instant quantity changes that undo on error; unavailable lines disabled.
  - Done: undo tested; cart hidden for admins.
  - Screen: [W5](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Guest: "Sign in to check out"; signed in: Check out opens [W7](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Unavailable line: greyed, "No longer available", removable; Check out removes it and says so; nothing available turns Check out off. Own meal: "You can't buy your own meals." Empty: "Your cart is empty" and a link to Meals.
- [ ] **Merge on sign-in** (4.3)
  - Build: fill `afterSignIn`: merge the guest cart in the verify request; guest cart `merged`; response lists merged and dropped lines.
  - Done: empty, full and overlapping carts; admin merges nothing; own meals dropped.
  - Check: one transaction.
  - Critical path: C2.

## Phase 5 — Checkout

- [ ] **Orders without Stripe** (5.1)
  - Build: `orders`, `prepper_invoices`, `order_lines`. Checkout takes pickup or delivery per Prepper and, for delivery, an address via `GET /api/places/addresses`. Makes a `pending_payment` order with snapshots (prices, handover method and address, emails); cart `checking_out`; cancel returns the cart to `active`; response includes `canEditCart`.
  - Done: two-Prepper cart makes 1 order and 2 invoices with correct totals; delivery refused outside a Prepper's radius; unavailable lines removed and reported; `422 own_meal`; empty cart 422.
  - Check: one transaction; totals from the server.
- [ ] **Payout tracking** (5.2)
  - Build: `payStatus` and `paidOutAt` on invoices; `POST /api/admin/invoices/:id/paid-out` through `transition()`.
  - Done: only `paid` or `handed_over`; repeat 409; non-admin 403; logged.
- [ ] **Start a payment** (5.3)
  - Build: Stripe PaymentIntent and `payments` row; return only the client secret. Cancelling an order cancels its PaymentIntent first; `409 payment_in_progress` while `processing` or `succeeded`.
  - Done: repeat calls reuse the payment; cancel refused while processing.
  - Check: amount from the order.
  - Docs: [PaymentIntents](https://docs.stripe.com/payments/payment-intents), [Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [ ] **Checkout screen** (5.4)
  - Build: pickup or delivery per Prepper, delivery address, Stripe Payment Element; Edit cart disabled when `canEditCart` is false; success page waits for paid; failure page.
  - Done: normal and 3DS test cards work on staging.
  - Check: the success page changes no status.
  - Screen: [W7](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Pickup shows the suburb until paid. Delivery turns off for Preppers who don't reach the address. Pay can't be pressed twice. Failed: Try again keeps the order; Back to cart cancels it.
  - Docs: [Payment Element](https://docs.stripe.com/payments/payment-element), [Test cards](https://docs.stripe.com/testing)
  - Critical path: R4.
- [ ] **Stripe webhook and emails** (5.5)
  - Build: verified webhook; skip repeated events; on success update payment, order, invoices and cart, and queue the buyer's receipt and each Prepper's new-order email in `email_outbox`; send after commit with Nodemailer; on failure update payment and cancel when final.
  - Done: each event type tested; a repeated event changes nothing; emails queued once.
  - Check: one transaction per event; failures to Sentry.
  - Docs: [Webhooks](https://docs.stripe.com/webhooks), [Stripe CLI](https://docs.stripe.com/cli/install), [Nodemailer](https://nodemailer.com/)
  - Critical path: R5, R6.
- [ ] **Buyer receipts** (5.6)
  - Build: list and view own orders, grouped by Prepper, with handover method, address and Prepper email.
  - Done: own orders only; snapshots shown.
  - Screen: [W9](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6), plus the receipts list in [W8](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Names and prices as at checkout; status Paid, then Handed over.
  - Critical path: C3.
- [ ] **Prepper invoices** (5.7)
  - Build: list own invoices with meals, buyer email, handover address and pay status; mark `handed_over`; last one completes the order.
  - Done: own invoices only; bad moves 409.
  - Screen: [W11](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Banner shows food safety and whether they're in browse, and what to fix. Filters: All, To hand over, Handed over. Mark handed over on paid invoices, with a confirm.
  - Check: both updates in one transaction.
  - Critical path: C4.

## Phase 6 — Buyer extras

- [ ] **Buyer profile** (6.1)
  - Build: name, suburb, dietary needs; browse starts with saved dietary filters.
  - Done: update tested; saved filters removable.
  - Screen: [W8](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Side menu has Start selling, or Selling for a Prepper.
- [ ] **Reviews** (6.2)
  - Build: review a paid-for meal once; show averages.
  - Done: non-buyers, repeats and deactivated Preppers' meals rejected.
  - Screen: [W9](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Write review on paid or handed-over lines: 1–5 stars, optional comment; then "Reviewed".
  - Critical path: R7.
- [ ] **Favourites** (6.3)
  - Build: favourite Preppers and meals; favourites page.
  - Done: toggling twice is safe; own favourites only; hidden for admins.
  - Screen: [W8](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6) Favourites, with Meals and Preppers tabs; the heart removes one.

## Phase 7 — Admin

- [ ] **Admin lists** (7.1)
  - Build: Meals, Preppers and Buyers lists (API and screens): search, status (incl. deactivated), created date, sort, paging on the server; meals add featured. The food safety queue is Preppers filtered to `pending_review`.
  - Done: admin only; bad parameters rejected.
  - Check: only allowed sort columns.
  - Screen: [W14](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Tabs: Meals, Preppers, Buyers. Preppers add a food safety filter. Row menu: view, deactivate, reactivate. Every action logged.
- [ ] **Manage accounts** (7.2)
  - Build: API only. Invite admin, edit, deactivate and reactivate buyers and Preppers; log every action.
  - Done: each action tested and logged; inviting an existing email 409.
- [ ] **Purchases list** (7.3)
  - Build: orders filtered by date, status, Prepper and pay status; one invoice per Prepper; Mark paid out; totals owed per Prepper.
  - Done: each filter and paid out tested.
  - Screen: [W16](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Owed strip counts invoices paid or handed over, not yet paid out. Confirm before marking paid out.
- [ ] **Flag and feature meals** (7.4)
  - Build: API only. Flag with reason and email the Prepper; unflag; feature and unfeature.
  - Done: flagged meals leave browse; email queued.
- [ ] **Food safety review** (7.5)
  - Build: API only. Short-lived signed licence link; approve or reject with reason; email the result.
  - Done: approve makes the Prepper public; reject needs a reason.
  - Check: file links expire quickly.
- [ ] **Detail views** (7.6)
  - Build: meal, buyer and Prepper detail pages wiring 7.2, 7.4 and 7.5.
  - Done: each page and action tested; admins never show deactivate.
  - Screen: [W13](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6), [W15](https://claude.ai/artifact/8KZKfE2Ajo2BXPqRxwciT3#d43ae32e-e1a6). Pending queue oldest first. Decisions are saved, then emailed. A verified Prepper shows Deactivate and Reactivate instead of Approve and Reject.
  - Critical path: C5, R8, R9.

## Phase 8 — Hardening

- [ ] **Scheduled jobs** (8.1)
  - Build: with Supabase `pg_cron`: abandon guest carts 1 hour after last edit (every 5 minutes); cancel unpaid orders after 24 hours unless payment is `processing`; retry unsent emails.
  - Done: tested with a fixed clock; safe to run twice.
  - Docs: [Supabase Cron](https://supabase.com/docs/guides/cron)
- [ ] **Nightly release suite** (8.2)
  - Build: nightly run of all `@critical` and `@release` scenarios.
  - Done: full run passes with videos.
  - Check: no scenario depends on another; no secrets in videos.
- [ ] **Limits and alerts** (8.3)
  - Build: checkout rate limits in the database plus Vercel Firewall; security headers; size limits; Sentry alerts for webhook failures and error spikes.
  - Done: limits return 429; a forced webhook failure alerts.
  - Docs: [Vercel Firewall](https://vercel.com/docs/vercel-firewall)
