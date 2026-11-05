# Preppers

A marketplace where home cooks (Preppers) sell prepared meals to buyers. An admin runs the site and verifies Preppers.

## Language

**Account**:
One person's sign-in identity, matched by email. It is either a buyer or an admin.
_Avoid_: User, profile

**Buyer**:
An account that can browse, order, review and save favourites.
_Avoid_: Customer, user

**Admin**:
An account that runs the site. It cannot buy, sell or review.
_Avoid_: Staff, moderator

**Prepper**:
A buyer who has a Prepper profile and sells meals.
_Avoid_: Seller, vendor, cook, chef

**Prepper profile**:
The selling details attached to a buyer account: kitchen, delivery and food safety status.
_Avoid_: Shop, store

**Verified Prepper**:
A Prepper whose food safety check an admin has approved. Only a verified Prepper's meals can be browsed and bought.
_Avoid_: Approved Prepper

**Guest**:
A person who isn't signed in. Can browse and fill a cart.
_Avoid_: Visitor, anonymous user

**Food safety check**:
An admin's review of a Prepper's licence before they can sell. Draft, pending review, verified or rejected.
_Avoid_: Application, Prepper check, verification

**Browse**:
The public lists where buyers find meals and Preppers.
_Avoid_: Shop, store

**Meal**:
A dish a Prepper offers for sale.
_Avoid_: Product, item, listing

**Hidden**:
A meal the Prepper took off browse. They can show it again.

**Flagged**:
A meal an admin took off browse, with a reason. Only an admin can unflag it.
_Avoid_: Reported, banned

**Archived**:
A meal retired for good. It still shows on old receipts.
_Avoid_: Deleted

**Featured**:
A meal an admin picked for the Home page.

**Cart**:
The meals a buyer or guest plans to buy, from any number of Preppers. A guest cart merges into the account's cart on sign-in.
_Avoid_: Basket, bag

**Order**:
One checkout by a buyer, paid once. The buyer sees it as a receipt.
_Avoid_: Purchase, transaction

**Prepper invoice**:
One Prepper's share of an order: their meals and what they are owed.
_Avoid_: Sub-order, bill

**Handed over**:
The Prepper confirms the buyer has received every meal on their invoice, by pickup or delivery. Says nothing about money.
_Avoid_: Delivered, fulfilled, completed

**Paid out**:
An admin has recorded that a Prepper was paid their invoice total, outside the app.
_Avoid_: Settled, transferred

**Deactivated**:
An account an admin has switched off. It cannot sign in. Its details and orders are kept. A deactivated Prepper's meals are hidden, cannot be added to a cart and cannot be reviewed.
_Avoid_: Banned, deleted, suspended
