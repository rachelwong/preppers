# Business rules

The server enforces every rule. Numbers in brackets are the stages that build them. Terms: [CONTEXT.md](../CONTEXT.md).

## Accounts

- One account per email. Two types: `buyer` and `admin`. The type never changes in the app. (0.3)
- Any buyer can buy, except from their own Prepper profile. Selling needs a Prepper profile. (2.1)
- An admin has no cart, orders, reviews, favourites or Prepper profile, and only uses the admin area. (1.4, 7.2)
- Only an admin deactivates or reactivates a buyer or Prepper account, with a reason. Owners can't deactivate themselves. (7.2)
- Admin accounts can't be deactivated or removed. (7.2)
- A deactivated account can't sign in and keeps its details and orders. (1.2, 7.2)
- A deactivated Prepper's meals leave browse and can't be added to a cart, checked out or reviewed. Their paid invoices wait until reactivation, because only the owner hands over. (3.1, 4.1, 5.1, 6.2, 7.2)
- Nothing is ever deleted. Accounts are deactivated; meals are hidden or archived. (2.5, 7.2)
- Email is the only link to Supabase Auth, so it can't change. `name+tag@gmail.com` is a different email from `name@gmail.com`. (1.1)
- First admin: `npm run db:seed-admin`. More admins: an admin invites them by email; an email that already has an account answers 409. See [api/README.md](../api/README.md#admin-set-up). (1.4, 7.2)

## Preppers and food safety

- Buyers can buy only from a verified Prepper with an active account. (2.9, 7.5)
- `draft` and `pending_review` Preppers can build meals, hidden from browse. A `rejected` Prepper can't create or edit meals until they fix their details and resubmit. (2.4, 2.5, 3.1)
- A verified Prepper never goes back to another food safety status. Editing licence details doesn't trigger a new review. To stop a Prepper selling, an admin deactivates them. (7.5)
- Every Prepper offers pickup. Delivery is optional: yes/no plus a radius of 1–50 km. No delivery fees. (2.1, 3.3)
- Public pages show only the suburb. The street address shows only on paid receipts. Coordinates never leave the server; distance is shown to the nearest km. (3.4, 5.6)

**Food safety step** (2.9). Queensland home kitchens generally need a council food licence and a named Food Safety Supervisor ([ABLIS](https://ablis.business.gov.au/service/qld/food-business-licence-goondiwindi-/5499)). Other states differ; check before launch. Not legal advice.

- Asks for: state and council; licence number; licence expiry (in the future); supervisor name and certificate number (typed, not uploaded); licence file (PDF, JPEG or PNG, up to 5 MB, private bucket); a tick-box declaring the details are true.
- An admin checks the licence file through a short-lived signed link, then approves or rejects with a reason. Both email the Prepper. (7.5)
- Licence expiry isn't tracked. If a licence lapses, an admin deactivates the Prepper.
- Development seeds Preppers as `verified`, so phases 3–6 don't wait for 7.5.

## Meals

- Prices are whole cents, always AUD, more than 0. (2.4)
- A Prepper shows, hides or archives their own meals. (2.5)
- Only admins flag or unflag, with a reason; flagging emails the Prepper. A flagged meal can't be shown or archived by its Prepper. Unflagging makes it `active`. (7.4)
- Only admins feature meals. Home shows the 4 most recently featured active meals. (3.6, 7.4)
- An ordered meal still shows on old receipts, whatever its status. (2.5)
- Photos: jpeg, png or webp, up to 2 MB. (2.7)

## Cart

- Guests can fill a cart. It's stored on the server; the browser holds only an httpOnly guest-token cookie. (4.1)
- On sign-in the guest cart merges into the account cart. An admin signing in merges nothing; the guest cart expires. (4.3)
- Quantity is 1–20 per meal. Prices are always read from the database. (4.1)
- A meal that can't be bought now (hidden, flagged, archived, or its Prepper deactivated or unverified) stays as a disabled line, left out of the total. Starting checkout removes those lines for good and tells the buyer. (4.1, 4.2, 5.1)
- A Prepper can't buy their own meals: `422 own_meal` on add and at checkout. A merge drops them, merges the rest and tells the buyer. (4.1, 4.3, 5.1)
- Guest carts untouched for 1 hour are abandoned. Every edit restarts the hour. (4.1, 8.1)

## Checkout and payment

- One checkout makes one order, split into one Prepper invoice per Prepper. (5.1)
- For each Prepper the buyer chooses pickup or delivery. Delivery is offered only if that Prepper delivers and the order's delivery address is inside their radius. One delivery address per order. (5.1)
- Frozen on the invoice at checkout: meal names and prices, handover method, handover address, buyer and Prepper emails. (5.1)
- The cart is locked while checking out. The buyer can cancel the order to edit the cart, except while its payment is `processing` or `succeeded`. The API returns `canEditCart`; the web app disables Edit cart when it's false; the server refuses with `409 payment_in_progress`. (5.1, 5.4)
- Cancelling an order first cancels its Stripe payment. Unpaid orders are cancelled after 24 hours, unless their payment is `processing`. (5.3, 8.1)
- Only Stripe's webhook can mark an order paid. (5.5)
- Every payment goes to the platform's Stripe account. Preppers are paid their invoice total outside the app; an admin marks the invoice `paid_out` once it's `paid` or `handed_over`. (5.2, 7.3)

## Handover and contact

- Contact is by email only. Paid receipts show each Prepper's email and handover address; invoices show the buyer's email and handover address. (5.6, 5.7)
- Only the owning Prepper marks an invoice handed over, and only once it's paid. (5.7)
- An order is completed when all its invoices are handed over. (5.7)

## Emails

- Sent from preppers.au@gmail.com over SMTP (Resend once there's a domain).
- Queued in the outbox in the same transaction as the change; sent after commit; up to 5 retries. (5.5, 8.1)
- On payment: a receipt to the buyer and a new-order email to each Prepper. (5.5)
- Also: meal flagged, food safety approved or rejected. (7.4, 7.5)

## Locations

- Suburb and postcode search runs only on submit: saved answer, then Photon, then LocationIQ. The position goes into the URL, so paging and filters make no new lookups. Both fail: "Location search is unavailable, try Use my location". (3.3)
- Street addresses (Prepper pickup, buyer delivery) show suggestions after 3 characters and a pause: Photon, then LocationIQ. The position is saved with the address. (2.3, 5.1)
- "Use my location" uses the browser only. (3.3)
- Saved answers are kept no longer than the provider's terms allow. LocationIQ's attribution link is shown wherever its results are. (2.3, 3.3)

## Reviews and favourites

- A buyer reviews a meal only from their own order line whose invoice is `paid` or `handed_over`; rating 1–5; one review per order line. (6.2)
- Saving a favourite twice changes nothing. (6.3)

## Records

- Every status change writes a `StatusEvent`; every other admin edit writes an `AuditLog` row. (0.6, 7.2)

## Not in v1

- Refunds and disputes. If a Prepper is deactivated with paid invoices not handed over, an admin sorts it out outside the app.
- Automatic payouts to Preppers.
- Delivery fees, delivery times and order cut-offs.
- Messaging and phone numbers (contact is by email).
- NDIS invoicing.
- Licence expiry tracking.
- Google or other single sign-on.
- Changing an account's email.
- Blocking a deactivated person from signing up again with a plus-tag email (an admin deactivates the new account).
