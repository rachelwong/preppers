#!/bin/bash
# Blocks Bash commands that run pnpm. Project uses npm.
# Matches pnpm as a command (e.g. "pnpm test", "cd api && pnpm dev",
# "npx pnpm i"), not as an argument (e.g. "grep pnpm README.md").

cmd=$(jq -r '.tool_input.command // ""')

runs_pnpm='(^|[;&|(`]|\$\(|npx|corepack|exec|env)[[:space:]]*pnpm([[:space:]]|$)'
grep -qE "$runs_pnpm" <<<"$cmd" || exit 0

echo "pnpm is not allowed. Use npm (npm install, npm run <script>, npx)." >&2
exit 2
