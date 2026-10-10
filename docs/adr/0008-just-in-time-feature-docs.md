# 0008 — Feature docs written per stage

- **Status:** accepted
- **Date:** 2026-10-10

## Problem

Rachel writes the code from the docs. Detailed instructions written months ahead drift as the code changes.

## Options

1. Full feature docs for all 50 stages up front.
2. Full docs for early phases, contracts for later ones.
3. Write each stage's feature doc when the stage starts, after checking the current code against later stages.

## Decision

Option 3. On "start X.Y", Claude reads the code, checks it against the scope of all later stages, lists blockers, then writes `docs/features/X.Y-<name>.md` from the template.

## Consequences

- Instructions always match the real code.
- Later stages rely on the scope in `08-stages.md`, the data model and the business rules staying current.
- Each stage starts with a short doc review before coding.
