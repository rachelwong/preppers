# Account

## Fields

| Field       | Type          | Key | Rules                      |
| ----------- | ------------- | --- | -------------------------- |
| id          | uuid          | PK  |                            |
| email       | text          | UK  | stored lowercase           |
| name        | text          |     | 1–80 characters            |
| accountType | AccountType   |     | buyer or admin; set when created |
| status      | AccountStatus |     | active, suspended, deactivated |
| suburb      | text          |     | optional                   |
| dietaryTags | DietaryTag[]  |     |                            |
| createdAt   | timestamptz   |     |                            |
| updatedAt   | timestamptz   |     |                            |

## Links

```mermaid
flowchart LR
  A[Account] -->|"can have 1"| PP[PrepperProfile]
  A -->|"owns many"| C[Cart]
  A -->|"places many"| O[Order]
  A -->|"writes many"| R[Review]
  A -->|"saves many"| F[Favourites]
```

- **Does:** signs in and edits own profile. Buyers also buy, review and save favourites. Admins do none of those.
- **Checks:** email unique; name 1–80 characters; suspended accounts can't sign in; a deactivated account keeps its details and becomes `active` when its owner signs in again; type never changes in the app; an admin has no profile, carts, orders, reviews or favourites; an admin can't suspend or deactivate themselves; the last active admin can't be suspended.
- **Built in:** 0.3, 1.1, 6.1, 7.2
- [Back to data model](../../plan/06-data-model.md)
