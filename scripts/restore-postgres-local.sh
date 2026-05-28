#!/usr/bin/env sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "Uso: ./scripts/restore-postgres-local.sh ./backups/archivo.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"
DB_NAME="${POSTGRES_DB:-intracorp_helpdesk}"
DB_USER="${POSTGRES_USER:-intracorp}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "No existe el backup: $BACKUP_FILE"
  exit 1
fi

echo "Limpiando schema public en $DB_NAME..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" <<SQL
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO "$DB_USER";
GRANT ALL ON SCHEMA public TO public;
SQL

echo "Restaurando backup..."
gunzip -c "$BACKUP_FILE" | psql -v ON_ERROR_STOP=1 -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"

echo "Restore local aplicado desde: $BACKUP_FILE"
