#!/usr/bin/env bash
set -euo pipefail
if command -v pkill >/dev/null 2>&1; then
  pkill -f "vite --host 0.0.0.0" || true
else
  echo "Stop the Vite terminal session manually on this platform."
fi
