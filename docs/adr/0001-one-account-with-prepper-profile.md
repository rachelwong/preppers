# 0001 — One account with an optional prepper profile

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Notion lists four user types (prepper, buyer, admin, visitor). The Miro diagram modelled `Admin`, `Member` and `Prepper` as subtypes of `User` with a `role` enum. A person who cooks may also want to buy.

## Options

1. Role enum on one user table — simple, but one role can't be both buyer and prepper.
2. Separate tables per role — repeats email, status and timestamps in each.
3. One `Account` + optional 1:1 `PrepperProfile` + `isAdmin` flag — anyone can buy; selling is an add-on.

## Decision

Option 3. Every signed-in person has an `Account`. Selling adds a `PrepperProfile` keyed by `accountId`. Admin is `isAdmin`. Visitors have no account and use a guest cart.

## Consequences

- A buyer can become a prepper without a new account.
- Guards check capabilities (`isAdmin`, has a verified profile), not a role.
- Admins can't remove their own flag, so at least one admin always remains.
- Stages: 0.3, 1.4, 2.1.
