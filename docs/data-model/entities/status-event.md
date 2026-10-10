# StatusEvent

## Fields

| Field      | Type        | Key | Rules                                                            |
| ---------- | ----------- | --- | ---------------------------------------------------------------- |
| id         | uuid        | PK  |                                                                  |
| entityType | text        |     | account, PrepperProfile, product, cart, order, invoice, payment |
| entityId   | uuid        |     | id in that table                                                 |
| fromStatus | text        |     | empty when created                                               |
| toStatus   | text        |     |                                                                  |
| actorType  | ActorType   |     | account, system, stripe                                          |
| actorId    | uuid        |     | optional                                                         |
| reason     | text        |     | optional                                                         |
| createdAt  | timestamptz |     |                                                                  |

## Links

points at any table through `entityType` + `entityId`, so it has no fixed foreign key.

- **Does:** keeps the history of every status change.
- **Checks:** never updated or deleted; written in the same transaction as the change.
- **Built in:** 0.6
- [Back to data model](../../plan/06-data-model.md)
