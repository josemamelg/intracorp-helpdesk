#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
FILE="${BACKUP_DIR}/intracorp-helpdesk-${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-intracorp}" "${POSTGRES_DB:-intracorp_helpdesk}" | gzip > "$FILE"

echo "Backup creado: $FILE"
