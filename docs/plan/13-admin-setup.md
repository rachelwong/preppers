# Admin set-up

Admin is its own account type. An admin runs the site and can't buy, sell or review. See [ADR 0001](../adr/0001-one-account-with-prepper-profile.md) and the [business rules](04-business-rules.md).

## Make the first admin (you)

There are no admin screens until an admin exists, so the first one is made from the command line (script built in stage 1.4).

1. In `api/.env`, set `SEED_ADMIN_EMAIL` to your own email address.
2. Inside `api`, run `pnpm db:seed-admin`.
   - No account with that email: it creates an `admin` account.
   - A buyer account exists but has no orders, cart items or Prepper profile: it changes it to `admin`.
   - Anything else: it stops and says why. Nothing is changed.
3. Sign in with the email code as normal. The API matches your email to the existing account, and you land in the admin area.

For staging and production:

1. Point `DATABASE_URL` at that database for one run and use the same script. Don't commit the value.
2. Or, in the Supabase SQL editor, insert the account row with `account_type = 'admin'` and `status = 'active'`.

Don't change a person's email in the Supabase dashboard. Accounts are matched by email, so they would appear as a new buyer.

## Add another admin

Done in the app (stage 7.2).

1. Sign in as an admin and open Accounts.
2. Choose Invite admin and enter their name and email.
3. The API creates an `admin` account with that email. It is logged in `AuditLog`.
4. They sign in with the email code.

Rules:

- The email must not already have an account. If it does, the API answers 409.
- A person with a buyer account who should become an admin needs a different email.

## Removing an admin

Admins can't be removed. Admin accounts can't be deactivated, by themselves or by other admins. Deactivate and reactivate only apply to buyer and Prepper accounts.
