# 0001 — One account with an optional Prepper profile

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Notion lists four user types (Prepper, buyer, admin, visitor). The Miro diagram modelled `Admin`, `Member` and `Prepper` as subtypes of `User` with a `role` enum. A person who cooks may also want to buy. An admin has separate duties and should never buy or sell.

## Options

1. Role enum on one user table — simple, but one role can't be both buyer and Prepper.
2. Separate tables per role — repeats email, status and timestamps in each.
3. One `Account` with an `accountType` of `buyer` or `admin`, plus an optional 1:1 `PrepperProfile` for buyers — anyone can buy; selling is an add-on; admin is its own type.

## Decision

Option 3. Every signed-in person has an `Account`. Its `accountType` is `buyer` or `admin` and doesn't change in the app. Selling adds a `PrepperProfile` keyed by `accountId`, for buyers only. Admins have no cart, orders, reviews, favourites or profile. Visitors have no account and use a guest cart.

## Consequences

- A buyer can become a Prepper without a new account.
- Guards check the account type and capabilities (`accountType`, has a verified profile).
- Admin accounts can't be deactivated or removed, so admins always remain. Only admins deactivate buyer and Prepper accounts; owners can't deactivate their own.
- The first admin is made with a seed script. See [Admin set-up](../plan/13-admin-setup.md).
- Stages: 0.3, 1.4, 2.1, 7.2.
