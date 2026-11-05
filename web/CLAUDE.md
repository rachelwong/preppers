# web rules

1. Server calls only through `src/api/`. Server data lives in TanStack Query only.
2. API types come from generated `src/api/schema.d.ts`. Never hand-write them.
3. Signed-in state from `useMe()` only. Never store auth tokens.
4. Filters and search in URL search params.
5. UI from shadcn/ui components. Labels on inputs, keyboard reachable, visible focus.
6. Dates shown in `Australia/Brisbane`. No price maths sent to the server.
7. Only `VITE_` public keys here.

Tests: Testing Library and MSW for loading, empty, error, success.
