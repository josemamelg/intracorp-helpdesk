# 10 - Incidentes simulados

## Objetivo

Generar errores controlados y practicar diagnostico.

## Desde la UI

Entra con `admin@intracorp.local` y abre `Errores`.

Ejecuta:

- Forzar error 500.
- Simular latencia.
- Simular error SQL.

## Desde terminal

```powershell
docker compose logs backend --tail 100
Get-Content .\logs\backend\error.log -Tail 50
```

## Criterio de exito

Para cada incidente escribe:

- Sintoma.
- Endpoint afectado.
- Log relevante.
- Causa probable.
- Accion correctiva.
