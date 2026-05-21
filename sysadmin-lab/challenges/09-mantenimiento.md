# 09 - Simular mantenimiento

## Objetivo

Practicar una ventana de mantenimiento controlada.

## Pasos

1. Entra como admin.
2. Abre `Errores`.
3. Activa modo mantenimiento.
4. Revisa `Sistema`.
5. Crea un backup.
6. Reinicia servicios.

```powershell
.\scripts\backup-postgres.ps1
docker compose restart backend nginx
docker compose ps
```

## Criterio de exito

La app vuelve a estar disponible y puedes justificar que hiciste backup antes de reiniciar.

## Preguntas

- Que comunicarias a usuarios antes de la ventana?
- Que validarias despues?
