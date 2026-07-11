#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  printf 'Usage: %s <backup.sql.gz>\n' "$0" >&2
  exit 2
fi

backup="$1"
test -f "$backup"
if [ -f "$backup.sha256" ]; then sha256sum --check "$backup.sha256"; fi

gzip -dc "$backup" | docker compose exec -T db psql \
  --username "${POSTGRES_USER:-postgres}" \
  --dbname "${POSTGRES_DB:-knowledge_assistant}" \
  --set ON_ERROR_STOP=on

docker compose exec -T backend alembic upgrade head
printf 'Restore and migration completed.\n'
