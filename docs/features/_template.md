# <phase>.<n> — <stage name>

- **Branch:** `stage/<phase>.<n>-<name>`
- **Depends on:** <stages that must be merged first>
- **Business rules:** <links to the rules in ../plan/04-business-rules.md this stage enforces>
- **Entities:** <links to ../data-model/entities/*.md this stage touches>

## Goal

One sentence: what works after this stage that didn't before.

## Forward check

What Claude found in the current code that matters for later stages, and what was decided.

- <finding> → <decision: fix now / new stage / leave>

## How

Numbered steps in the order to build them. Each step names the file, route, table or component.

1. **Database:** <migration name, tables and columns, indexes>
2. **Contract:** <zod route schemas in api, regenerated openapi.json, web types via gen:api>
3. **API:** <route, method, request and response shape, errors and status codes>
4. **Web:** <route, components, queries and mutations>
5. **Tests:** <unit and API cases to write>
6. **Critical path:** <scenario to add or update in e2e, if this stage completes one>

## Routes

| Method | Path | Who | Request | Response | Errors |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Edge cases

- <case> → <expected behaviour>

## Done when

- <checkable outcome>

## Review will check

- <what Claude looks for>

## Docs

- [<official doc>](<link>)
