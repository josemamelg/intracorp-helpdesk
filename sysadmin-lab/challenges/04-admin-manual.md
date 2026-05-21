# 04 - Crear usuario admin manualmente

## Objetivo

Simular recuperacion de acceso administrativo.

## Comando

```powershell
Get-Content .\scripts\create-admin.sql | docker compose exec -T postgres psql -U intracorp intracorp_helpdesk
```

## Validacion

Ingresa con:

```text
admin.manual@intracorp.local
Password123!
```

## Criterio de exito

El usuario puede entrar y ver dashboard, usuarios, auditoria y sistema.

## Preguntas

- Que controles pondrias antes de permitir este procedimiento en una empresa?
- Como dejarias evidencia de esta accion?
