#!/usr/bin/env bash
# PostToolUse (Edit|Write): formats and lints the file that was just touched, and records
# which side (frontend/backend) changed so the Stop hook knows what to re-check.
# Informational only — never blocks the agent, just fixes style and surfaces lint output.
set -uo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
session_id="$(printf '%s' "$input" | jq -r '.session_id // "nosession"')"
marker="${TMPDIR:-/tmp}/claude-flowsync-touched-${session_id}"

[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0

case "$file" in
  "$repo_root"/frontend/*)
    echo "frontend" >> "$marker"
    bin_dir="$repo_root/frontend/node_modules/.bin"
    case "${file##*.}" in
      ts|tsx|js|jsx|json|css|md)
        [ -x "$bin_dir/prettier" ] && "$bin_dir/prettier" --write "$file" >/dev/null 2>&1
        ;;
    esac
    if [ -x "$bin_dir/oxlint" ]; then
      lint_output="$("$bin_dir/oxlint" "$file" 2>&1)"
      [ -n "$lint_output" ] && echo "$lint_output" >&2
    fi
    ;;
  "$repo_root"/backend/*)
    echo "backend" >> "$marker"
    bin_dir="$repo_root/backend/node_modules/.bin"
    case "${file##*.}" in
      ts|js|json|md)
        [ -x "$bin_dir/prettier" ] && "$bin_dir/prettier" --write "$file" >/dev/null 2>&1
        ;;
    esac
    if [ -x "$bin_dir/eslint" ]; then
      lint_output="$("$bin_dir/eslint" "$file" --no-warn-ignored 2>&1)"
      [ -n "$lint_output" ] && echo "$lint_output" >&2
    fi
    ;;
esac

exit 0
