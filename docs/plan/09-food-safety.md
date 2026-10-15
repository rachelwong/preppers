# Food safety checks

Preppers add a food safety step at sign-up. An admin approves it before they appear in browse or can be bought from.

## Why

- In Queensland, home-based meal businesses generally need a council food licence and a named Food Safety Supervisor ([ABLIS](https://ablis.business.gov.au/service/qld/food-business-licence-goondiwindi-/5499), [Somerset council](https://www.somerset.qld.gov.au/environmental-health/food/8)).
- Other states have different rules. Check with councils before launch. This isn't legal advice.

## What the sign-up step asks for

- State and council
- Licence or registration number
- Licence expiry date (must be in the future)
- Food Safety Supervisor name and certificate number (typed in; the certificate itself isn't uploaded)
- Licence file (PDF, JPEG or PNG, up to 5 MB; the only upload in this step)
- A tick-box declaring the details are true

## Where files are kept

- Supabase Storage. Meal photos go in a public bucket; licence files go in a private one.
- The browser uploads straight to Storage with a signed upload link from the API. It never sees the storage secret key.

## How it works, step by step

```mermaid
flowchart LR
  A[Prepper fills step] --> B[pending_review]
  B --> C{Admin checks<br/>licence file}
  C -->|approve| D[verified<br/>shows in browse]
  C -->|reject + reason| E[rejected]
  E -->|fix and resubmit| B
```

1. The Prepper fills in the step and moves to `pending_review` (stage 2.9).
2. They can keep adding meals while they wait.
3. An admin checks the licence file in the queue (stage 7.5). They open it through a short-lived signed link; the private bucket is never public. This is manual; there's no national licence lookup.
4. The admin approves or rejects with a reason. The Prepper gets an email either way.
5. Approved Preppers show in browse and can be bought from.
6. Licence expiry isn't tracked in the first version. If a licence lapses, an admin deactivates the Prepper.

## For development

- Seed Prepper as `verified`, so phases 3–6 don't wait for stage 7.5.
