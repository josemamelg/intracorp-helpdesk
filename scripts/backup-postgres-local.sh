#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_NAME="${POSTGRES_DB:-intracorp_helpdesk}"
DB_USER="${POSTGRES_USER:-intracorp}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
FILE="${BACKUP_DIR}/intracorp-helpdesk-local-${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" | gzip > "$FILE"

echo "Backup local creado: $FILE"
