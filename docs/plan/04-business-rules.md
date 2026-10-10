# Business rules

The server enforces every rule below. Numbers in brackets are the stages that build them.

**Accounts**

- One account per email address. Anyone can buy; selling needs a prepper profile. (0.3, 2.1)
- Admin is a yes/no flag. An admin can't remove their own flag. (1.4, 7.2)
- Suspended or deleted accounts can't sign in. Deleting wipes personal details but keeps orders for records. (1.2, 7.2)

**Preppers**

- A prepper can be bought from only when they are `verified` and Stripe payouts are on. (2.9, 5.2, 7.5)
- Unverified preppers can build products but are hidden from browse. (3.1)
- Only the suburb is shown publicly; the exact address never is. (3.4)
- Delivery is a yes/no plus a radius of 1–50 km. There are no delivery fees. (2.1, 3.3)
- Buyers search by suburb, postcode or browser location. Prepper coordinates never leave the server; only distance to the nearest km is shown. (3.3)

**Products**

- Prices are whole cents in AUD, more than 0. (2.4)
- A prepper can show, hide or archive their own products. Only admins can flag or unflag. (2.5, 7.4)
- Products that have been ordered are archived, never deleted. (2.5)
- Photos are jpeg, png or webp, up to 2 MB. (2.7)

**Cart**

- Guests can fill a cart; it merges into the account cart on sign-in. (4.1, 4.3)
- Quantity is 1–20 per product. (4.1)
- Prices are always read from the database, never taken from the browser. (4.1)
- The cart is locked while checking out. (5.1)
- Guest carts untouched for 30 days are abandoned. (8.1)

**Checkout and payment**

- One checkout makes one order, split into one invoice per prepper. (5.1)
- Names and prices are frozen on each order line at checkout. (5.1)
- Only Stripe's webhook can mark an order paid. (5.5)
- Editing the cart cancels a pending order. Unpaid orders are cancelled after 24 hours. (5.1, 8.1)
- Each prepper is paid their invoice total after payment; failed payouts are retried. (5.5, 8.1)
- No refunds in the first version.

**Promo codes**

- Codes are created and turned off by an admin in the Stripe Dashboard. The app doesn't store codes. (5.8)
- One code per order. Stripe must say it's active, not expired, in AUD and over any minimum amount. (5.8)
- Our own count of uses must be under the code's limit. Stripe doesn't count uses for our payments. (5.8, 5.9)
- The discount never goes above the subtotal. (5.8)
- The discount is split across invoices by their share of the subtotal; the shares add up exactly. (5.9)
- Who pays for the discount is still open (see the [decision log](11-decision-log.md)).

**Handing over meals**

- Only the prepper who owns an invoice can mark it handed over, and only after it is paid. (5.7)
- An order is completed when all its invoices are handed over. (5.7)

**Reviews and favourites**

- A buyer can review a product only from a paid order line, once per product, rating 1–5. (6.2)
- Saving a favourite twice changes nothing. (6.3)

**Admin and records**

- Every status change is recorded in `StatusEvent`; every other admin edit in `AuditLog`. (0.6, 7.2)
- Flagging a product hides it and emails the prepper. (7.4)
- Rejecting a prepper's licence needs a reason. (7.5)
- Emails go out only after the change is saved, with up to 5 retries. (7.4, 8.1)
