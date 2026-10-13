# 0005 — Stripe Connect with separate charges and transfers

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

One checkout can contain meals from several Preppers. Each Prepper must be paid their share.

## Options

1. One platform account and an internal payout ledger — simpler, but money tracking is ours to build.
2. Stripe Connect destination charges — one Prepper per payment only.
3. Stripe Connect separate charges and transfers — one payment, many transfers.

## Decision

Option 3, in test mode, with Stripe-hosted onboarding for Preppers. Start from Stripe's Connect integration guide (the older Express account setup is legacy for new platforms).

## Consequences

- The platform charges the buyer once; the webhook queues one transfer per invoice.
- The platform balance must cover transfers; failed transfers are retried (8.1).
- Stages: 5.2–5.5. Guide: https://docs.stripe.com/connect/separate-charges-and-transfers
