# Runbook: Backup y Restore de PostgreSQL

## Objetivo

Crear, validar y restaurar backups de la base de datos `intracorp_helpdesk`.

Este runbook aplica al entorno Docker Compose del laboratorio IntraCorp Helpdesk.

## Servicios involucrados

- `postgres`: base de datos principal.
- `backend`: API que consume PostgreSQL.
- `backups/`: carpeta local donde se guardan dumps.

## Antes de empezar

Verificar que los servicios estan levantados:

```bash
docker compose ps
curl http://localhost:8080/api/health/db
```

La respuesta esperada debe incluir:

```json
{
  "status": "ok",
  "database": "reachable"
}
```

## Crear backup

```bash
chmod +x scripts/backup-postgres.sh
./scripts/backup-postgres.sh
```

El backup se guarda en:

```text
backups/intracorp-helpdesk-YYYYMMDD-HHMMSS.sql.gz
```

## Listar backups

```bash
ls -lh backups/
```

## Validar contenido del backup

Sin restaurarlo, se puede inspeccionar una parte del dump:

```bash
gunzip -c backups/NOMBRE_DEL_BACKUP.sql.gz | head -n 30
```

## Prueba controlada de restore

### 1. Crear un backup antes del cambio

```bash
./scripts/backup-postgres.sh
```

Guardar el nombre del archivo generado.

### 2. Modificar un dato de prueba

```bash
docker compose exec postgres psql -U intracorp intracorp_helpdesk
```

Dentro de `psql`:

```sql
SELECT id, title, status FROM tickets ORDER BY id;
UPDATE tickets SET status = 'closed' WHERE id = 1;
SELECT id, title, status FROM tickets WHERE id = 1;
\q
```

### 3. Restaurar backup

```bash
./scripts/restore-postgres.sh backups/NOMBRE_DEL_BACKUP.sql.gz
```

El script reinicia el schema `public` antes de cargar el dump:

```sql
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
```

Esto evita errores por tablas, tipos, indices y claves primarias ya existentes.

### 4. Validar restore

```bash
docker compose exec postgres psql -U intracorp intracorp_helpdesk
```

```sql
SELECT id, title, status FROM tickets WHERE id = 1;
\q
```

Confirmar que el estado volvio al valor que tenia al momento del backup.

## Validacion posterior

```bash
curl http://localhost:8080/api/health/db
curl http://localhost:8080/api/health
docker compose logs --tail=40 backend
docker compose logs --tail=40 postgres
```

## Riesgos

- Restaurar sobre una base activa puede pisar cambios recientes.
- Un backup no probado no garantiza recuperacion.
- Si se restaura el archivo equivocado, se puede volver a un estado incorrecto.
- Conviene documentar fecha, motivo y responsable de cada restore.
- Cargar un dump SQL completo encima de una base existente sin limpiarla puede producir errores como `relation already exists`, `type already exists` o claves duplicadas.

## Criterio de exito

- El backup existe en `backups/`.
- El archivo puede leerse con `gunzip -c`.
- La restauracion termina sin errores.
- `/api/health/db` responde `database: reachable`.
- Los datos restaurados coinciden con el estado esperado.

## Registro sugerido

```text
Fecha:
Responsable:
Motivo:
Archivo de backup:
Comando usado:
Resultado:
Validacion:
Observaciones:
```
