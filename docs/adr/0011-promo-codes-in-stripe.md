# 0011 — Promo codes live in Stripe

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Buyers type a promo code at checkout. Somewhere has to hold the codes, their discount and their limits.

## Options

1. Our own `promo_codes` table with admin screens — full control, but we rebuild what Stripe already has.
2. Stripe coupons and promotion codes, made in the Stripe Dashboard — no code table or create screens; one place to manage discounts.

## Decision

Option 2. An admin creates the coupon and promotion code in Stripe. The API looks up the typed code with the Stripe API and checks it's active, not expired, in AUD and over any minimum amount.

Stripe only applies and counts codes itself in Stripe Checkout. We use our own PaymentIntents, so:

- the API works out the discount in cents and charges the lower amount;
- the API counts uses from `promo_redemptions` against the code's limit.

## Consequences

- No `promo_codes` table. Carts store the typed code and Stripe's ID for it.
- Stripe's "times redeemed" number stays at 0 for our codes. Stage 7.6 shows our own count instead.
- Tests mock Stripe's promotion code replies.
- Who pays for the discount is still open (5.9).
- Stages: 5.8, 5.9, 7.6. Guide: https://docs.stripe.com/payments/advanced/discounts
