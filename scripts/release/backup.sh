#!/usr/bin/env sh
set -eu

backup_dir="${BACKUP_DIR:-backups}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
target="$backup_dir/cognolith-$timestamp.sql.gz"

docker compose exec -T db pg_dump \
  --username "${POSTGRES_USER:-postgres}" \
  --dbname "${POSTGRES_DB:-knowledge_assistant}" \
  --clean --if-exists --no-owner | gzip > "$target"

sha256sum "$target" > "$target.sha256"
printf 'Backup written to %s\n' "$target"
