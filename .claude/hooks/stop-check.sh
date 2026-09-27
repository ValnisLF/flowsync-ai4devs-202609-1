#!/usr/bin/env bash
# Stop: checks the marker the PostToolUse hook left for this session — only the sides
# (frontend/backend) the agent actually edited THIS session, not pre-existing repo dirt.
# Runs lint (+tests on backend) for those sides. Exit 2 blocks the stop and feeds stderr
# back to the agent so it fixes the failure instead of finishing with broken code.
set -uo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root" || exit 0

input="$(cat)"
session_id="$(printf '%s' "$input" | jq -r '.session_id // "nosession"')"
marker="${TMPDIR:-/tmp}/claude-flowsync-touched-${session_id}"

[ -f "$marker" ] || exit 0
touched="$(sort -u "$marker")"

fail=0
report=""

if printf '%s\n' "$touched" | grep -qx "frontend"; then
  if ! out="$(cd frontend && npm run lint --silent 2>&1)"; then
    fail=1
    report="${report}--- frontend lint (oxlint) failed ---
${out}

"
  fi
fi

if printf '%s\n' "$touched" | grep -qx "backend"; then
  if ! out="$(cd backend && npm run lint --silent 2>&1)"; then
    fail=1
    report="${report}--- backend lint (eslint) failed ---
${out}

"
  fi
  if ! out="$(cd backend && npm test --silent 2>&1)"; then
    fail=1
    report="${report}--- backend tests failed ---
${out}

"
  fi
fi

if [ "$fail" != "0" ]; then
  echo "$report" >&2
  exit 2
fi

rm -f "$marker"
exit 0
