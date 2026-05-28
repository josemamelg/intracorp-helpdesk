#!/usr/bin/env sh
set -eu

DB_USER="${POSTGRES_USER:-intracorp}"
DB_NAME="${POSTGRES_DB:-intracorp_helpdesk}"
BASE_URL="${BASE_URL:-http://localhost:8080}"

fail() {
  echo "FAIL $1"
  exit 1
}

sql_scalar() {
  docker compose exec -T postgres psql -U "$DB_USER" "$DB_NAME" -tA -c "$1" | tr -d '\r'
}

echo "Verificando salud HTTP..."
curl -fsS --max-time 8 "$BASE_URL/api/health/db" >/dev/null || fail "API no puede conectar con PostgreSQL"
echo "OK   API conecta con PostgreSQL"

echo "Verificando tablas principales..."
users_count="$(sql_scalar "SELECT COUNT(*) FROM users;")"
tickets_count="$(sql_scalar "SELECT COUNT(*) FROM tickets;")"
comments_count="$(sql_scalar "SELECT COUNT(*) FROM ticket_comments;")"
audit_count="$(sql_scalar "SELECT COUNT(*) FROM audit_logs;")"

[ "$users_count" -gt 0 ] || fail "No hay usuarios"
[ "$tickets_count" -gt 0 ] || fail "No hay tickets"
[ "$comments_count" -gt 0 ] || fail "No hay comentarios"
[ "$audit_count" -gt 0 ] || fail "No hay registros de auditoria"

echo "OK   users=$users_count tickets=$tickets_count comments=$comments_count audit_logs=$audit_count"

echo "Verificando usuario admin..."
admin_row="$(sql_scalar "SELECT name || '|' || role || '|' || active FROM users WHERE email = 'admin@intracorp.local';")"
[ -n "$admin_row" ] || fail "No existe admin@intracorp.local"

admin_name="$(printf '%s' "$admin_row" | cut -d '|' -f 1)"
admin_role="$(printf '%s' "$admin_row" | cut -d '|' -f 2)"
admin_active="$(printf '%s' "$admin_row" | cut -d '|' -f 3)"

[ "$admin_role" = "admin" ] || fail "admin@intracorp.local no tiene rol admin"
case "$admin_active" in
  t|true)
    ;;
  *)
    fail "admin@intracorp.local no esta activo"
    ;;
esac

echo "OK   admin=$admin_name role=$admin_role active=$admin_active"

echo "Verificando ticket base..."
ticket_row="$(sql_scalar "SELECT title || '|' || status FROM tickets WHERE id = 1;")"
[ -n "$ticket_row" ] || fail "No existe ticket id=1"

ticket_title="$(printf '%s' "$ticket_row" | cut -d '|' -f 1)"
ticket_status="$(printf '%s' "$ticket_row" | cut -d '|' -f 2)"

case "$ticket_status" in
  open|in_progress|waiting_user|resolved|closed)
    echo "OK   ticket_1=\"$ticket_title\" status=$ticket_status"
    ;;
  *)
    fail "Ticket id=1 tiene estado invalido: $ticket_status"
    ;;
esac

echo "Verificacion post-restore completada."
