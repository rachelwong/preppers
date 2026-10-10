# Business rules

The server enforces every rule below. Numbers in brackets are the stages that build them.

**Accounts**

- One account per email address. There are two account types: `buyer` and `admin`. (0.3)
- Anyone with a buyer account can buy. Selling needs a Prepper profile. (2.1)
- Admin is its own type, not a buyer or a Prepper. An admin has no cart, orders, reviews, favourites or Prepper profile, and only uses the admin area. (1.4, 7.2)
- An admin can't suspend or deactivate themselves. The last active admin can't be suspended. (7.2)
- Suspended accounts can't sign in. A deactivated account keeps its details and orders; signing in again reactivates it. Unused accounts are left alone. (1.2, 7.2)
- Nothing is ever deleted. Accounts are deactivated; products are hidden or archived. (2.5, 7.2)
- How the first admin is made, and how admins are added and removed: [Admin set-up](13-admin-setup.md).

**Preppers**

- A Prepper can be bought from only when they are `verified` and Stripe payouts are on. (2.9, 5.2, 7.5)
- Unverified Prepper can build products but are hidden from browse. (3.1)
- Only the suburb is shown publicly; the exact address never is. (3.4)
- Delivery is a yes/no plus a radius of 1–50 km. There are no delivery fees. (2.1, 3.3)
- Buyers search by suburb, postcode or browser location. Prepper coordinates never leave the server; only distance to the nearest km is shown. (3.3)

**Products**

- Prices are whole cents in AUD, more than 0. (2.4)
- A Prepper can show, hide or archive their own products. (2.5)
- Only admins can flag or unflag a product. Flagging takes it off browse, needs a reason and emails the Prepper. While it is flagged, the Prepper can't show or archive it. Unflagging makes it `active` again. (7.4)
- Products are never deleted. A product that has been ordered still shows on old receipts, whatever its status. (2.5)
- Photos are jpeg, png or webp, up to 2 MB. (2.7)

**Cart**

- Guests can fill a cart; it merges into the account cart on sign-in. (4.1, 4.3)
- A guest cart is stored on the server. The browser keeps only an HTTP-only cookie with the guest token, not local or session storage. (4.1)
- Quantity is 1–20 per product. (4.1)
- Prices are always read from the database, never taken from the browser. (4.1)
- The cart is locked while checking out. (5.1)
- Guest carts untouched for 1 hour are abandoned. Every cart edit restarts the hour. (4.1, 8.1)

**Checkout and payment**

- One checkout makes one order, split into one invoice per Prepper. (5.1)
- Names and prices are frozen on each order line at checkout. (5.1)
- Only Stripe's webhook can mark an order paid. (5.5)
- Editing the cart cancels a pending order. Unpaid orders are cancelled after 24 hours. (5.1, 8.1)
- Each Prepper is paid their invoice total after payment; failed payouts are retried. (5.5, 8.1)
- No refunds in the first version.

**Promo codes**

- Codes are created and turned off by an admin in the Stripe Dashboard. The app doesn't store codes. (5.8)
- One code per order. Stripe must say it's active, not expired, in AUD and over any minimum amount. (5.8)
- Our own count of uses must be under the code's limit. Stripe doesn't count uses for our payments. (5.8, 5.9)
- The discount never goes above the subtotal. (5.8)
- The discount is split across invoices by their share of the subtotal; the shares add up exactly. (5.9)
- Who pays for the discount is still open (see the [decision log](11-decision-log.md)).

**Handing over meals**

- Only the Prepper who owns an invoice can mark it handed over, and only after it is paid. (5.7)
- An order is completed when all its invoices are handed over. (5.7)

**Reviews and favourites**

- A buyer can review a product only from an order line whose invoice is `paid` or `handed_over`, rating 1–5. There is one review per order line. (6.2)
- Saving a favourite twice changes nothing. (6.3)

**Admin and records**

- Every status change is recorded in `StatusEvent`; every other admin edit in `AuditLog`. (0.6, 7.2)
- Rejecting a Prepper's licence needs a reason. (7.5)
- Emails go out only after the change is saved, with up to 5 retries. (7.4, 8.1)
