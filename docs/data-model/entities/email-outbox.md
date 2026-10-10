# EmailOutbox

## Fields

| Field | Type | Key | Rules |
| --- | --- | --- | --- |
| id | uuid | PK |  |
| toAddress | text |  |  |
| template | text |  |  |
| payload | jsonb |  |  |
| idempotencyKey | text | UK | template/entity id |
| attempts | int |  | max 5 |
| lastError | text |  | optional |
| sentAt | timestamptz |  | empty until sent |
| createdAt | timestamptz |  |  |

## Links

 none. Each row is filled in by the action that caused the email.

- **Does:** queues emails so they only go out after the change is saved.
- **Checks:** written in the same transaction as its cause; sent after commit; retried up to 5 times.
- **Built in:** 7.4, 7.5, 8.1
- [Back to data model](../../plan/06-data-model.md)
