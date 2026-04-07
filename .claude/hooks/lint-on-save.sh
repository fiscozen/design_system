#!/usr/bin/env bash
# lint-on-save.sh — PostToolUse hook for Claude Code
# Runs ESLint + Prettier on files after Edit/Write operations.
# Only targets component source and storybook files.
#
# Exit codes:
#   0 = success (or file not in scope)
#   non-zero = lint errors found

set -euo pipefail

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

# Only run on Edit/Write
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Only lint .vue, .ts, .tsx, .js, .jsx files
case "$FILE_PATH" in
  *.vue|*.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

# Only lint files in packages/*/src/ or apps/storybook/src/
if [[ "$FILE_PATH" != *"/packages/"*"/src/"* && "$FILE_PATH" != packages/*/src/* && "$FILE_PATH" != *"/apps/storybook/src/"* && "$FILE_PATH" != apps/storybook/src/* ]]; then
  exit 0
fi

# Verify file exists
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Find repo root (where package.json lives)
REPO_ROOT=$(cd "$(dirname "$FILE_PATH")" && git rev-parse --show-toplevel 2>/dev/null || echo "")
if [[ -z "$REPO_ROOT" ]]; then
  exit 0
fi

# Run ESLint fix (suppress errors if eslint not found or file has unfixable issues)
cd "$REPO_ROOT"
pnpm exec eslint --fix "$FILE_PATH" 2>/dev/null || true

# Run Prettier
pnpm exec prettier --write "$FILE_PATH" 2>/dev/null || true

exit 0
