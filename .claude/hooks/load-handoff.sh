#!/bin/bash
# On a new or cleared session, loads the latest HANDOFF.md as context.

file="${CLAUDE_PROJECT_DIR:-.}/HANDOFF.md"
[ -f "$file" ] || exit 0

updated=$(date -r "$file" '+%Y-%m-%d %H:%M')
branch=$(git -C "${CLAUDE_PROJECT_DIR:-.}" branch --show-current 2>/dev/null)

context="HANDOFF.md (last updated ${updated}, current branch: ${branch}) is the handoff from the previous session. Use it as your starting context: check it still matches git status and git log, then carry on from its Next step. If it looks stale or unrelated to what Rachel asks, say so before relying on it.

$(cat "$file")"

jq -n --arg ctx "$context" \
  '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'
