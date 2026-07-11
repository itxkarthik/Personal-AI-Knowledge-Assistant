#!/usr/bin/env sh
set -eu

frontend_url="${FRONTEND_URL:-http://127.0.0.1:8080}"
backend_url="${BACKEND_URL:-http://127.0.0.1:3000}"

curl --fail --silent --show-error "$backend_url/health/live" >/dev/null
curl --fail --silent --show-error "$backend_url/health/ready" >/dev/null
curl --fail --silent --show-error "$frontend_url/auth/login" >/dev/null
printf 'Cognolith smoke checks passed.\n'
