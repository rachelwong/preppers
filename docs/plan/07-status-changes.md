# Status changes

## Rules for every status

- Allowed moves for each entity live in one map in `api/src/services/status.ts`. The web app gets the status values through the OpenAPI contract.
- One function, `transition(tx, entity, id, to, actor, reason?)`, makes every change and returns 409 for a move not on the map.
- Each change also writes a `StatusEvent` row in the same database transaction.
- Only Stripe's webhook can say money was received. The browser can't.

## Checkout

One Stripe webhook moves cart, order, payment and invoices together.

```mermaid
stateDiagram-v2
  direction LR
  state "Cart" as CartS {
    [*] --> active
    active --> checking_out: checkout
    checking_out --> active: order cancelled
    checking_out --> ordered: webhook paid
  }
```

```mermaid
stateDiagram-v2
  direction LR
  [*] --> pending_payment: checkout
  pending_payment --> paid: webhook payment_intent.succeeded
  pending_payment --> cancelled: cart edited / payment canceled / 24h
  paid --> completed: last invoice handed over
  note right of paid: Order
```

```mermaid
stateDiagram-v2
  direction LR
  [*] --> requires_payment_method: PaymentIntent created
  requires_payment_method --> requires_action: 3DS needed
  requires_action --> processing
  requires_payment_method --> processing: card submitted
  processing --> requires_payment_method: payment failed, retry
  processing --> succeeded: webhook
  requires_payment_method --> canceled: webhook
  note right of processing: Payment (mirrors Stripe PaymentIntent status)
```

```mermaid
stateDiagram-v2
  direction LR
  [*] --> pending_payment: checkout
  pending_payment --> paid: with order
  pending_payment --> cancelled: with order
  paid --> handed_over: Prepper marks
  note right of paid: PrepperInvoice
```

### Step by step

1. The buyer fills a cart. The cart is `active`.
2. The buyer checks out. The cart becomes `checking_out`. An order and one invoice per Prepper are created as `pending_payment`, and a Stripe payment starts.
3. The buyer pays. 3DS checks and failed attempts move the payment between `requires_action`, `processing` and `requires_payment_method`; the order stays `pending_payment`.
4. Stripe's webhook confirms payment. In one transaction: payment becomes `succeeded`, the order and invoices become `paid`, the cart becomes `ordered`, and each Prepper's pay is queued.
5. Each Prepper marks their invoice `handed_over` once the buyer has the meals.
6. When the last invoice is handed over, the order becomes `completed`.

### If it goes wrong

- The buyer edits the cart during checkout: the order and invoices are `cancelled`, and the cart goes back to `active`.
- The payment is cancelled: the same as above.
- The order is still unpaid after 24 hours: a scheduled job cancels it.
- Paying a Prepper fails: `PrepperPayStatus` becomes `failed`; a scheduled job retries it.

## Accounts and Prepper checks

A Prepper sells only while verified.

```mermaid
stateDiagram-v2
  direction LR
  [*] --> active: first sign-in
  active --> deactivated: admin (buyer and Prepper accounts only)
  deactivated --> active: admin
  note right of active: Account
```

```mermaid
stateDiagram-v2
  direction LR
  [*] --> draft
  draft --> pending_review: submit food safety step
  pending_review --> verified: admin approves
  pending_review --> rejected: admin rejects (reason)
  rejected --> pending_review: resubmit
  verified --> expired: licence lapses (later)
  expired --> pending_review: new licence submitted
  note right of verified: PrepperProfile.foodSafetyStatus
```

### Account, step by step

1. Created as `active` the first time someone signs in.
2. An admin can deactivate a buyer or Prepper account and later reactivate it. Deactivated accounts can't sign in. Details and orders are kept.
3. Owners can't deactivate their own account. Admin accounts can't be deactivated.
4. Nothing is deleted. Accounts can stay deactivated for as long as needed.

### Prepper check, step by step

1. A new Prepper starts in `draft`.
2. Submitting the food safety step moves them to `pending_review`.
3. An admin approves (`verified`) or rejects with a reason (`rejected`).
4. A rejected Prepper can fix and resubmit.
5. Only `verified` Preppers show in browse and can be bought from.
6. To stop a verified Prepper selling, an admin deactivates their account. Later, licences that run out will move to `expired`.

## Products

```mermaid
stateDiagram-v2
  direction LR
  [*] --> active
  active --> hidden: Prepper
  hidden --> active: Prepper
  active --> flagged: admin
  hidden --> flagged: admin
  flagged --> active: admin unflags
  active --> archived: Prepper or admin
  hidden --> archived: Prepper or admin
  flagged --> archived: admin
```

- `archived` is permanent. Products are never deleted, and old receipts still show them.

## Guest carts

- Guest cart → `merged` when the guest signs in.
- Guest cart → `abandoned` after 1 hour untouched. Every cart edit restarts the hour.

## Allowed-move map

| Entity          | From → To                                  | Actor                              |
| --------------- | ------------------------------------------ | ---------------------------------- |
| Account         | active ↔ deactivated (not admin accounts)  | admin                              |
| PrepperProfile | draft, rejected, expired → pending_review  | Prepper                            |
| PrepperProfile | pending_review → verified, rejected        | admin                              |
| PrepperProfile | verified → expired                         | system                             |
| Product         | active ↔ hidden                            | Prepper                            |
| Product         | active, hidden → flagged; flagged → active | admin                              |
| Product         | any → archived                             | Prepper (not from flagged), admin |
| Cart            | active → checking_out                      | buyer                              |
| Cart            | checking_out → active                      | system                             |
| Cart            | checking_out → ordered                     | stripe                             |
| Cart            | active → merged, abandoned                 | system                             |
| Order           | pending_payment → paid                     | stripe                             |
| Order           | pending_payment → cancelled                | buyer, stripe, system              |
| Order           | paid → completed                           | system                             |
| PrepperInvoice | pending_payment → paid                     | stripe                             |
| PrepperInvoice | pending_payment → cancelled                | system                             |
| PrepperInvoice | paid → handed_over                         | Prepper                            |
| Payment         | any Stripe status → its new Stripe status  | stripe                             |
