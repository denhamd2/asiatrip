#!/usr/bin/env bash
set -euo pipefail

CREDS_DIR="${HOME}/.google-mcp"
CREDS_FILE="${CREDS_DIR}/gcp-oauth.keys.json"

mkdir -p "${CREDS_DIR}"

usage() {
  cat <<'EOF'
Google MCP setup for Cursor (Gmail + Calendar)

Usage:
  ./scripts/setup-google-mcp.sh check   # verify credentials file exists
  ./scripts/setup-google-mcp.sh auth    # run OAuth for Gmail and Calendar
  ./scripts/setup-google-mcp.sh help    # show this message

Before running auth:
  1. Enable Gmail API + Google Calendar API in Google Cloud Console
  2. Create OAuth Desktop client credentials
  3. Save as ~/.google-mcp/gcp-oauth.keys.json

After auth:
  Restart Cursor → Settings → Tools & MCP → verify google-gmail and google-calendar are connected
EOF
}

check_creds() {
  if [[ ! -f "${CREDS_FILE}" ]]; then
    echo "Missing credentials: ${CREDS_FILE}"
    echo "Download OAuth Desktop credentials from Google Cloud Console first."
    exit 1
  fi
  echo "Found credentials at ${CREDS_FILE}"
}

auth_gmail() {
  echo "Authenticating Gmail MCP..."
  GMAIL_OAUTH_PATH="${CREDS_FILE}" npx -y @gongrzhe/server-gmail-autoauth-mcp auth
}

auth_calendar() {
  echo "Authenticating Google Calendar MCP..."
  GOOGLE_OAUTH_CREDENTIALS="${CREDS_FILE}" npx -y @cocal/google-calendar-mcp auth
}

cmd="${1:-help}"
case "${cmd}" in
  check)
    check_creds
    ;;
  auth)
    check_creds
    auth_gmail
    auth_calendar
    echo ""
    echo "Done. Restart Cursor and open Settings → Tools & MCP to verify both servers."
    ;;
  help|*)
    usage
    ;;
esac
