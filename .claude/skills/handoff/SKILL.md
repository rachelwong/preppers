---
name: handoff
description: Write or update HANDOFF.md so a fresh Preppers session can carry on this work. Use when a session is getting long, before starting a fresh session mid-stage, or when Rachel asks for a handoff note.
---

Write or update a handoff note so the next session, starting with fresh context, can continue this work.

Steps:

1. Check if `HANDOFF.md` exists in the repo root. If it does, read it first and update it rather than starting over.
2. Run `git status` and `git log --oneline -10` on the current branch, so the note matches what is actually committed.
3. Write the note with these sections. Short bullets, plain English, Australian spelling.
   - **Goal**: the stage and step (e.g. `2.1 — step 3`), and the feature doc path in `docs/features/`.
   - **Where we are in the build flow**: which step of "How every change is built" in `CLAUDE.md` we're on (doc approved? tests committed? Rachel OK'd the test list? reviews run?).
   - **Done**: what's finished, with commit hashes where useful.
   - **What worked**: approaches that succeeded.
   - **What didn't work**: approaches that failed, and why, so they aren't repeated.
   - **Open decisions**: anything waiting on Rachel. Say what's needed from her.
   - **Next step**: the very next action, then the ones after it.
   - **Files**: files changed or about to change, and the docs to read first.
4. Don't paste code or long logs. Point to files and commits instead.
5. Save it as `HANDOFF.md` in the repo root. Don't commit it unless Rachel asks.
6. Tell Rachel the full path, so she can start a fresh session with just: "Read HANDOFF.md and continue."
