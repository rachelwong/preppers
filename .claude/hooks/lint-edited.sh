#!/bin/bash
# Runs ESLint on each file Claude edits, so AGENTS.md rules are caught at once.
# Exit 2 sends the errors back to Claude to fix. Skips quietly when the file
# isn't TS/JS in an app folder, or the app has no ESLint installed yet.

input=$(cat)
file=$(jq -r '.tool_input.file_path // empty' <<<"$input")

[ -n "$file" ] || exit 0

case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs) ;;
  *) exit 0 ;;
esac

root="$CLAUDE_PROJECT_DIR"
rel="${file#"$root"/}"
app="${rel%%/*}"

case "$app" in
  api|web|e2e) ;;
  *) exit 0 ;;
esac

eslint="$root/$app/node_modules/.bin/eslint"
[ -x "$eslint" ] || exit 0

output=$(cd "$root/$app" && "$eslint" --no-warn-ignored "$file" 2>&1)
[ $? -eq 0 ] && exit 0

echo "ESLint errors in $rel. Fix them before moving on:" >&2
echo "$output" >&2
exit 2
