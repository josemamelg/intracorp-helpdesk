#!/usr/bin/env sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "Uso: ./scripts/restore-postgres.sh ./backups/archivo.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "No existe el backup: $BACKUP_FILE"
  exit 1
fi

gunzip -c "$BACKUP_FILE" | docker compose exec -T postgres psql -U "${POSTGRES_USER:-intracorp}" "${POSTGRES_DB:-intracorp_helpdesk}"

echo "Restore aplicado desde: $BACKUP_FILE"
