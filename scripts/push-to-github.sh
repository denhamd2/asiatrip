#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Your public SSH key (add at https://github.com/settings/ssh/new) ==="
cat ~/.ssh/id_ed25519.pub
echo ""
echo "Testing GitHub SSH..."
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
  echo "SSH not authorized yet. Add the key above to GitHub, then run this script again."
  exit 1
fi
echo "Pushing to origin main..."
git push -u origin main
echo "Done."
