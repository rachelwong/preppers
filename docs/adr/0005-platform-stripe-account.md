# 0005 — One platform Stripe account, Preppers paid outside the app

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

One checkout can contain meals from several Preppers. Each Prepper must be paid their share. Making every Prepper set up their own Stripe account is a lot of work for a first version.

## Options

1. One platform Stripe account takes every payment. Preppers are paid manually, outside the app.
2. Stripe Connect destination charges — one Prepper per payment only.
3. Stripe Connect separate charges and transfers — one payment, many transfers, and every Prepper needs a Stripe account.

## Decision

Option 1, in test mode. Every payment goes to the platform's Stripe account. Preppers never touch Stripe. The app records what each Prepper is owed on their `PrepperInvoice`; an admin pays them outside the app and marks the invoice `paid_out`.

## Consequences

- No Prepper onboarding, Connect accounts or transfers, so no payout retry job.
- Being bought from depends only on being `verified`.
- Each invoice has a pay status: `pending` or `paid_out`. Only an admin changes it, through `transition()`, and the change is logged.
- Buyers' receipts, Prepper invoices and the admin purchases list all show which meals belong to which Prepper.
- Refunds and automatic payouts are later work.
- Stages: 5.2–5.5, 7.3.
