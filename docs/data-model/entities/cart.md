# Cart

## Fields

| Field | Type | Key | Rules |
| --- | --- | --- | --- |
| id | uuid | PK |  |
| accountId | uuid | FK → [Account](account.md) | empty for guests |
| guestTokenHash | text | UK | empty for signed-in users |
| status | CartStatus |  | active, checking_out, ordered, merged, abandoned |
| promoCode | text |  | optional; the code the buyer typed |
| stripePromotionCodeId | text |  | optional; Stripe's ID for that code |
| createdAt | timestamptz |  |  |
| updatedAt | timestamptz |  |  |

## Links

```mermaid
flowchart LR
  C[Cart] -->|"belongs to 0 or 1"| A[Account]
  C -->|"holds many"| CI[CartItem]
  C -.->|"checks code with"| S[Stripe promotion code]
  C -->|"becomes 0 or 1"| O[Order]
```

- **Does:** holds what a buyer or guest wants to buy.
- **Checks:** has either an account or a guest token, never both; one active cart per account; no changes while `checking_out`; a promo code is rechecked with Stripe at checkout; subtotal worked out when read.
- **Built in:** 4.1–4.3, 5.1, 5.9
- [Back to data model](../../plan/06-data-model.md)
