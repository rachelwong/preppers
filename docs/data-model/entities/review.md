# Review

## Fields

| Field | Type | Key | Rules |
| --- | --- | --- | --- |
| id | uuid | PK |  |
| mealId | uuid | FK → [Meal](meal.md) |  |
| buyerId | uuid | FK → [Account](account.md) | taken from the session |
| orderLineId | uuid | FK → [OrderLine](order-line.md), UK | invoice `paid` or `handed_over` |
| rating | int |  | 1–5 |
| comment | text |  | 1–1,000 characters |
| createdAt | timestamptz |  |  |
| updatedAt | timestamptz |  |  |

## Links

```mermaid
flowchart LR
  R[Review] -->|"is about 1"| P[Meal]
  R -->|"written by 1"| A[Account]
  R -->|"proven by 1"| OL[OrderLine]
```

- **Does:** rates a meal the buyer has paid for.
- **Checks:** the order line belongs to the buyer and its invoice is `paid` or `handed_over`; one review per order line; not accepted while the meal's Prepper is deactivated.
- **Built in:** 6.2
- [Back to data model](../../plan/06-data-model.md)
