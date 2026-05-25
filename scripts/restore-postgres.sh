#!/usr/bin/env sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "Uso: ./scripts/restore-postgres.sh ./backups/archivo.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"
DB_USER="${POSTGRES_USER:-intracorp}"
DB_NAME="${POSTGRES_DB:-intracorp_helpdesk}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "No existe el backup: $BACKUP_FILE"
  exit 1
fi

echo "Limpiando schema public en $DB_NAME..."
docker compose exec -T postgres psql -U "$DB_USER" "$DB_NAME" <<SQL
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO "$DB_USER";
GRANT ALL ON SCHEMA public TO public;
SQL

echo "Restaurando backup..."
gunzip -c "$BACKUP_FILE" | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" "$DB_NAME"

echo "Restore aplicado desde: $BACKUP_FILE"
