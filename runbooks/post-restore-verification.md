# Runbook: Verificacion Post-Restore

## Objetivo

Validar que la base de datos quedo operativa despues de restaurar un backup.

Este paso evita falsos positivos como creer que un restore fue exitoso solo porque el comando termino.

## Cuándo usarlo

- Despues de ejecutar `scripts/restore-postgres.sh`.
- Despues de recrear la base de datos.
- Antes de dar por cerrado un incidente de recuperacion.

## Comando

```bash
chmod +x scripts/verify-db.sh
./scripts/verify-db.sh
```

## Que valida

- El backend puede conectarse a PostgreSQL usando `/api/health/db`.
- La tabla `users` tiene datos.
- La tabla `tickets` tiene datos.
- La tabla `ticket_comments` tiene datos.
- La tabla `audit_logs` tiene datos.
- Existe `admin@intracorp.local`.
- El usuario admin tiene rol `admin`.
- El usuario admin esta activo.
- Existe el ticket base `id=1`.
- El estado del ticket base pertenece a los estados validos.

## Salida esperada

```text
Verificando salud HTTP...
OK   API conecta con PostgreSQL
Verificando tablas principales...
OK   users=5 tickets=5 comments=4 audit_logs=3
Verificando usuario admin...
OK   admin=Jose Melgarejo role=admin active=true
Verificando ticket base...
OK   ticket_1="VPN no conecta desde fuera de oficina" status=in_progress
Verificacion post-restore completada.
```

## Si falla

Revisar:

```bash
docker compose ps
docker compose logs --tail=80 backend
docker compose logs --tail=80 postgres
curl http://localhost:8080/api/health/db
```

## Criterio de exito

El restore solo se considera validado cuando:

- `scripts/restore-postgres.sh` termina sin errores.
- `scripts/verify-db.sh` termina sin errores.
- `/api/health/db` responde `database: reachable`.
