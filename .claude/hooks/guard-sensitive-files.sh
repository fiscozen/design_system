#!/usr/bin/env bash
# guard-sensitive-files.sh — PreToolUse hook for Claude Code
# Blocks access to sensitive files and dangerous commands in the design system repo.
#
# Threat model: supply chain integrity for 47 public @fiscozen/* npm packages.
# Primary risks: token exposure, unauthorized publish, hook bypass.
#
# Exit codes:
#   0 = allow
#   2 = block (reason on stderr)

set -euo pipefail

# Read tool invocation JSON from stdin
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# ─── File access guard (Read, Edit, Write) ───────────────────────────────────

if [[ "$TOOL_NAME" == "Read" || "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  if [[ -n "$FILE_PATH" ]]; then
    BASENAME=$(basename "$FILE_PATH")

    # Block .env files (except .env.example / .env.dist)
    if [[ "$BASENAME" == .env || "$BASENAME" == .env.* ]]; then
      if [[ "$BASENAME" != ".env.example" && "$BASENAME" != ".env.dist" ]]; then
        echo "BLOCKED: $FILE_PATH — .env files may contain tokens (Chromatic, FontAwesome). Use environment variables instead." >&2
        exit 2
      fi
    fi

    # Block .npmrc (contains token interpolation patterns)
    if [[ "$BASENAME" == ".npmrc" ]]; then
      echo "BLOCKED: .npmrc contains registry token configuration. Do not read or modify." >&2
      exit 2
    fi

    # Block certificate and key files
    case "$BASENAME" in
      *.pem|*.key|*.crt|*.cert|*.p12|*.pfx|*.gpg)
        echo "BLOCKED: $FILE_PATH — certificate/key file." >&2
        exit 2
        ;;
    esac

    # Block git internals (absolute or repo-relative paths)
    if [[ "$FILE_PATH" == *"/.git/"* || "$FILE_PATH" == .git/* ]]; then
      echo "BLOCKED: $FILE_PATH — git internals." >&2
      exit 2
    fi

    # Block Serena local config (prevents LLM persistence injection)
    if [[ "$FILE_PATH" == *".serena/project.local.yml" ]]; then
      echo "BLOCKED: .serena/project.local.yml — local override file, do not modify." >&2
      exit 2
    fi
  fi
fi

# ─── Bash command guard ──────────────────────────────────────────────────────

if [[ "$TOOL_NAME" == "Bash" && -n "$COMMAND" ]]; then

  # Block publish commands
  if echo "$COMMAND" | grep -qiE '(changeset\s+publish|changeset:publish|npm\s+publish|pnpm\s+publish)'; then
    echo "BLOCKED: Publishing is CI-only. Never run publish commands locally." >&2
    exit 2
  fi

  # Block changeset version (silent version bumps need review)
  if echo "$COMMAND" | grep -qiE 'changeset:version|changeset\s+version'; then
    echo "BLOCKED: changeset version bumps all package.json files. Run manually with review." >&2
    exit 2
  fi

  # Block hook bypass flags
  if echo "$COMMAND" | grep -qE '\-\-no-verify'; then
    echo "BLOCKED: --no-verify bypasses git hooks. Fix the underlying issue instead." >&2
    exit 2
  fi

  # Block SKIP_*_CHECK environment variables
  if echo "$COMMAND" | grep -qE 'SKIP_(CHANGESET|BUILD|STORYBOOK)_CHECK'; then
    echo "BLOCKED: SKIP_*_CHECK bypasses pre-push quality gates." >&2
    exit 2
  fi

  # Block destructive git operations
  if echo "$COMMAND" | grep -qE 'git\s+push\s+(.*\s)?(-f|--force)'; then
    echo "BLOCKED: Force push is destructive. Use regular push." >&2
    exit 2
  fi
  if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
    echo "BLOCKED: git reset --hard discards work. Use git stash or git checkout for specific files." >&2
    exit 2
  fi

  # Block bare env/printenv (would dump FONTAWESOME_PACKAGE_TOKEN)
  if echo "$COMMAND" | grep -qE '^\s*(env|printenv)\s*$'; then
    echo "BLOCKED: Bare env/printenv would expose environment tokens." >&2
    exit 2
  fi

  # Block reading sensitive files via shell commands
  if echo "$COMMAND" | grep -qE '(cat|head|tail|less|more|bat)\s+.*\.(env|npmrc|pem|key|crt)'; then
    echo "BLOCKED: Cannot read sensitive files via shell. Use environment variables." >&2
    exit 2
  fi
  if echo "$COMMAND" | grep -qE '(cat|head|tail|less|more|bat)\s+.*_secrets'; then
    echo "BLOCKED: Cannot read secrets files via shell." >&2
    exit 2
  fi

  # Block source .env
  if echo "$COMMAND" | grep -qE '(source|\.)\s+.*\.env'; then
    echo "BLOCKED: Cannot source .env files — would load tokens into shell." >&2
    exit 2
  fi
fi

# Allow everything else
exit 0
