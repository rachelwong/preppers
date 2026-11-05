# Testing

## Test-driven

Claude builds every feature and fix with the `mattpocock-skills:tdd` skill.

1. Write one failing test for one behaviour, through the public interface: a route via `app.inject()`, a screen via Testing Library.
2. Write the least code that makes it pass, then tidy up.
3. Repeat until the stage's **Done** line is covered, including each rule's failure path.
4. A failing test means the code is wrong. Change a test only when the behaviour itself changed, and say so in the diff summary.

Rachel reviews the tests in the final diff. Their names read as the list of behaviours.

## Layers

| Layer | Where | Tools | Runs |
| --- | --- | --- | --- |
| API | `api` | Vitest + Fastify `inject`, local Supabase | PRs touching `api` |
| Web | `web` | Vitest + Testing Library + MSW (loading, empty, error, success) | PRs touching `web` |
| Contract | both | regenerate `openapi.json` and web types; fail if changed | every PR |
| Critical paths | `e2e` | Playwright + playwright-bdd, video on | every PR |
| Release paths | `e2e` | same, tagged `@release`, video on failure | nightly |

Outside services are always mocked in `api` and `web` tests: Stripe, Photon, LocationIQ and email.

## Critical paths (every PR, with video)

| # | Path | Scenario | Stage |
| --- | --- | --- | --- |
| C1 | Sign in with a code, see your name, sign out, can't reach account pages | `sign-in-out.feature` | 1.6 |
| C2 | Guest adds meals, signs in, cart is still there | `guest-cart-merge.feature` | 4.3 |
| C3 | Buyer checks out from two Preppers, sees one receipt grouped by Prepper | `checkout-two-preppers.feature` | 5.6 |
| C4 | Prepper marks their invoice handed over; the order shows completed | `hand-over-order.feature` | 5.7 |
| C5 | New Prepper passes the food safety step, admin approves, Prepper appears in browse | `prepper-approved.feature` | 7.6 |

## Release paths (nightly)

| # | Path | Stage |
| --- | --- | --- |
| R1 | Guest browses and filters by cuisine and dietary needs | 3.2 |
| R2 | Search near a suburb or postcode; "delivers to me" | 3.3 |
| R3 | Prepper adds a meal with a photo, hides it, archives it | 2.8 |
| R4 | Checkout with a 3DS test card | 5.4 |
| R5 | Declined card, then a retry that succeeds | 5.5 |
| R6 | Editing the cart mid-checkout cancels the pending order | 5.5 |
| R7 | Buyer reviews a meal they bought; can't review one they didn't | 6.2 |
| R8 | Admin flags a meal; it leaves browse | 7.6 |
| R9 | Admin deactivates an account; it can't sign in | 7.6 |

## Writing e2e scenarios

```gherkin
@critical
Feature: Check out a cart from two Preppers

  Scenario: Buyer pays once and gets one receipt
    Given I am signed in as a buyer
    And my cart has "Beef rendang" from "Siti's Kitchen"
    And my cart has "Veggie lasagne" from "Nonna Rosa"
    When I check out and pay with the test card "4242 4242 4242 4242"
    Then I see a receipt with 2 Preppers
    And the order status is "paid"
```

- **Sign-in codes:** read from local Supabase's test inbox.
- **Stripe:** test cards in the Payment Element (use a frame locator); webhooks forwarded by the Stripe CLI; wait for `paid` before checking the receipt.
- **Places:** seed `geocode_cache` so scenarios make no outside calls.
- **Data:** each scenario seeds its own accounts and meals, so order doesn't matter.
- **Selectors:** `getByRole` and `getByLabel` first; `data-testid` last.
- **Time:** set the browser clock when time matters.
- **Video:** on for `@critical`, on failure otherwise; 1280×720; traces kept for `@critical` and failures.

## In CI

1. Start local Supabase and seed it.
2. Start api and web.
3. Start the Stripe CLI forwarder with the test key from GitHub secrets.
4. Run `@critical` on every PR, everything nightly.
5. Upload the HTML report as a private artifact (30 days). Traces can show cookies and emails, so never publish them.

Docs: [Playwright videos](https://playwright.dev/docs/videos), [trace viewer](https://playwright.dev/docs/trace-viewer), [Playwright in CI](https://playwright.dev/docs/ci-intro), [playwright-bdd](https://vitalets.github.io/playwright-bdd/), [Stripe test cards](https://docs.stripe.com/testing)
