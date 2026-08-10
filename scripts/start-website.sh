#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

notify() {
  osascript -e "display notification \"$2\" with title \"$1\"" 2>/dev/null || echo "[$1] $2"
}

if [[ ! -d node_modules ]]; then
  notify "Start website" "Installing dependencies — this may take a minute"
  npm install
  notify "Start website" "Dependencies installed"
fi

if lsof -ti:3000 >/dev/null 2>&1; then
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  sleep 0.5
fi

PORT=3000
if lsof -ti:3000 >/dev/null 2>&1; then
  PORT=3001
  notify "Start website" "Port 3000 is still busy — starting on 3001"
fi

exec env NODE_OPTIONS='--inspect' npm run dev -- -p "$PORT"
