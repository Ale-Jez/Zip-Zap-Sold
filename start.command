#!/bin/sh

# Double-click this file on macOS, or run: sh start.command
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-4173}"
URL="http://127.0.0.1:${PORT}"

echo "Starting Zip Zap Sold at ${URL}"
echo "Press Ctrl+C to stop the local server."
open "${URL}" 2>/dev/null || true
exec python3 -m http.server "${PORT}" --bind 127.0.0.1
