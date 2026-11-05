# 0014 — Claude Code builds, Rachel reviews

- **Status:** accepted
- **Date:** 2026-11-05

## Problem

The plan had Rachel writing all the code, with Claude planning and reviewing. The project's aim has changed: to find better ways of getting test-driven, reliable, focused, high-quality code and docs out of Claude Code.

## Options

1. Rachel keeps writing the code; Claude plans, writes tests and reviews.
2. Claude Code writes the code, tests and docs; Rachel approves plans and reviews every PR.
3. Choose who builds for each step.

## Decision

Option 2. Claude Code builds each stage from the approved feature doc, tests first, and checks its own work with the `test-writer`, `code-reviewer` and `docs-checker` subagents. Rachel approves each feature doc and test list, reviews every PR and merges.

## Consequences

- Stages move faster, and quality rests on tests written first and on independent subagent reviews.
- Feature docs are still written for a person, so Rachel can review them. [0008](0008-just-in-time-feature-docs.md) still applies.
- Rachel learns backend and SQL by reviewing. PR summaries explain backend choices in plain terms.
- Claude never merges or pushes to `main`.
- Every stage follows "How every change is built" in the root `CLAUDE.md`.
