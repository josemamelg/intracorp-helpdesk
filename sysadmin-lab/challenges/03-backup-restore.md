# 03 - Backup y restore

## Objetivo

Crear un backup, modificar datos y restaurarlos.

## Backup

```powershell
.\scripts\backup-postgres.ps1
Get-ChildItem .\backups
```

## Cambio controlado

```powershell
docker compose exec postgres psql -U intracorp intracorp_helpdesk
```

```sql
UPDATE tickets SET status = 'closed' WHERE id = 1;
SELECT id, title, status FROM tickets ORDER BY id;
```

## Restore

```powershell
.\scripts\restore-postgres.ps1 .\backups\NOMBRE_DEL_BACKUP.sql
```

## Criterio de exito

Puedes demostrar que los datos volvieron al estado del backup.

## Preguntas

- Que riesgo tiene restaurar sobre una base activa?
- Como validarias un backup sin afectar produccion?
