# Preppers end-to-end tests

Plain-English scenarios run in a real browser and recorded as video. Set up in stage 1.6. Journeys and conventions: [testing.md](../docs/testing.md).

- `features/`: one `.feature` file per journey (Given / When / Then).
- `steps/`: the code behind each step.
- `support/`: seed helpers and the sign-in code reader.

## Running it

1. Start the API and the web app.
2. Forward Stripe webhooks: `stripe listen --forward-to localhost:<api port>/api/webhooks/stripe`.
3. In `e2e`: `npm install`, then `npx playwright install chromium`.
4. `npm run test:critical` for `@critical`, or `npm test` for everything.
5. `npx playwright show-report` to watch videos and step through traces.
