# 02 - Revisar logs

## Objetivo

Aprender a localizar errores por servicio.

## Comandos

```powershell
docker compose logs -f nginx
docker compose logs -f backend
docker compose logs -f postgres
Get-ChildItem .\logs\backend
Get-Content .\logs\backend\app.log -Tail 20
```

## Practica

1. Inicia sesion con password incorrecta.
2. Revisa logs del backend.
3. Entra como admin.
4. Abre la vista de auditoria.

## Criterio de exito

Puedes explicar la diferencia entre:

- Logs del contenedor.
- Logs persistidos en `./logs/backend`.
- Auditoria guardada en PostgreSQL.
