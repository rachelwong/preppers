#!/bin/bash
# Runs test, lint and type-check in each app with uncommitted changes when
# Claude tries to finish. Exit 2 blocks the stop and sends failures back to fix.
# Skips apps with no package.json yet. Blocks once per stop to avoid loops.

input=$(cat)
[ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ] && exit 0

root="$CLAUDE_PROJECT_DIR"
failed=""

for app in api web; do
  [ -f "$root/$app/package.json" ] || continue
  [ -n "$(git -C "$root" status --porcelain -- "$app")" ] || continue

  for script in test lint typecheck; do
    output=$(cd "$root/$app" && pnpm run --if-present "$script" 2>&1)
    [ $? -eq 0 ] && continue

    failed+="
== $app: pnpm $script failed ==
$(tail -n 40 <<<"$output")
"
  done
done

[ -z "$failed" ] && exit 0

echo "Checks failed. Fix the code, not the tests:$failed" >&2
exit 2
