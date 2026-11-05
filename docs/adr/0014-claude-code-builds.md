# 0014 — Claude Code builds, Rachel reviews

- **Status:** accepted
- **Date:** 2026-11-05

## Problem

The plan had Rachel writing the code, with Claude planning and reviewing. The project's aim has changed: to find better ways of getting test-driven, reliable, high-quality code and docs out of Claude Code.

## Options

1. Rachel keeps writing the code; Claude plans, tests and reviews.
2. Claude Code writes the code, tests and docs; Rachel approves plans and reviews every diff.
3. Choose who builds for each step.

## Decision

Option 2. Claude builds test-first and checks its own work with the `code-reviewer` and `docs-checker` subagents. Rachel approves plans, reviews every diff, and commits and pushes. Feature docs are written for payments, auth and migrations, or when Rachel asks; other changes get a short plan in chat. This replaces [0008](0008-just-in-time-feature-docs.md).

## Consequences

- Quality rests on test-driven work, independent subagent reviews and Rachel's diff review.
- Rachel learns backend and SQL by reviewing diffs and questioning Claude.
- Claude never commits, pushes, merges or branches.
- The workflow lives only in the root `CLAUDE.md`.
