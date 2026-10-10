# StripeEvent

## Fields

| Field | Type | Key | Rules |
| --- | --- | --- | --- |
| id | text | PK | Stripe's event id |
| type | text |  | e.g. payment_intent.succeeded |
| processedAt | timestamptz |  |  |

## Links

 none. It stands alone as a list of webhooks already handled.

- **Does:** remembers every webhook already handled.
- **Checks:** saved first in the webhook transaction; if the id already exists, the event is skipped.
- **Built in:** 5.5
- [Back to data model](../../plan/06-data-model.md)
