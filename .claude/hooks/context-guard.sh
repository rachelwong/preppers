#!/bin/bash
# Warns Claude once per session when context use passes a threshold, so it
# writes HANDOFF.md (handoff skill) before the window fills. Autocompact is off.
#
# Tune with env vars in .claude/settings.local.json:
#   PREPPERS_CONTEXT_WINDOW   total window in tokens (default 1000000)
#   PREPPERS_HANDOFF_PERCENT  warn at this % used (default 75)

input=$(cat)
transcript=$(jq -r '.transcript_path // empty' <<<"$input")
session=$(jq -r '.session_id // "unknown"' <<<"$input")
event=$(jq -r '.hook_event_name // "PostToolUse"' <<<"$input")

[ -f "$transcript" ] || exit 0

marker="${TMPDIR:-/tmp}/preppers-handoff-warned-$session"
[ -f "$marker" ] && exit 0

used=$(grep '"usage"' "$transcript" \
  | jq -c 'select(.type == "assistant" and (.isSidechain | not)) | .message.usage' 2>/dev/null \
  | tail -1 \
  | jq '(.input_tokens // 0) + (.cache_read_input_tokens // 0) + (.cache_creation_input_tokens // 0)' 2>/dev/null)

[ -n "$used" ] || exit 0

window=${PREPPERS_CONTEXT_WINDOW:-1000000}
percent=${PREPPERS_HANDOFF_PERCENT:-75}
limit=$(( window * percent / 100 ))

[ "$used" -ge "$limit" ] || exit 0

touch "$marker"

msg="Context is at ${used} of ${window} tokens (over ${percent}%). Autocompact is off for this project. Finish the current small step only, then run the handoff skill to write or update HANDOFF.md. After that, stop and tell Rachel to type /clear (or open a new chat) so a fresh session starts from HANDOFF.md."

jq -n --arg event "$event" --arg msg "$msg" \
  '{systemMessage: "Context over threshold: Claude will write HANDOFF.md, then start a fresh session with /clear.",
    hookSpecificOutput: {hookEventName: $event, additionalContext: $msg}}'
