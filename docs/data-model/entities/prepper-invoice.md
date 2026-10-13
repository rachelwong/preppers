# PrepperInvoice

## Fields

| Field              | Type              | Key                                         | Rules                                         |
| ------------------ | ----------------- | ------------------------------------------- | --------------------------------------------- |
| id                 | uuid              | PK                                          |                                               |
| orderId            | uuid              | FK → [Order](order.md)                      |                                               |
| prepperId         | uuid              | FK → [PrepperProfile](prepper-profile.md) | one invoice per Prepper per order            |
| status             | InvoiceStatus     |                                             | pending_payment, paid, handed_over, cancelled |
| subtotalCents      | int               |                                             |                                               |
| totalCents         | int               |                                             |                                               |
| PrepperPayStatus  | PrepperPayStatus |                                             | pending, sent, failed                         |
| stripeTransferId   | text              |                                             | optional                                      |
| handedOverAt       | timestamptz       |                                             | optional                                      |
| createdAt          | timestamptz       |                                             |                                               |
| updatedAt          | timestamptz       |                                             |                                               |

## Links

```mermaid
flowchart LR
  I[PrepperInvoice] -->|"part of 1"| O[Order]
  I -->|"paid to 1"| PP[PrepperProfile]
  I -->|"contains 1 or more"| OL[OrderLine]
```

- **Does:** one Prepper's share of an order, and their payout. The payout is the subtotal.
- **Checks:** one per Prepper per order; only the owning Prepper can mark it `handed_over`, and only once `paid`.
- **Built in:** 5.1, 5.5, 5.7, 8.1
- [Back to data model](../../plan/06-data-model.md)
