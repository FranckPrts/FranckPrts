#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PORT=2000
FALLBACK_PORT=2001

notify() {
  osascript -e "display notification \"$2\" with title \"$1\"" 2>/dev/null || echo "[$1] $2"
}

if [[ ! -d node_modules ]]; then
  notify "Start website" "Installing dependencies — this may take a minute"
  npm install
  notify "Start website" "Dependencies installed"
fi

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  lsof -ti:"$PORT" | xargs kill -9 2>/dev/null || true
  sleep 0.5
fi

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  notify "Start website" "Port $PORT is still busy — starting on $FALLBACK_PORT"
  PORT=$FALLBACK_PORT
fi

exec env PORT="$PORT" NODE_OPTIONS='--inspect' npm run dev
