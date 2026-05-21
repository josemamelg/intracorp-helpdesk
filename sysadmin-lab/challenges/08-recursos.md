# 08 - Revisar consumo de recursos

## Objetivo

Observar uso de CPU, memoria y procesos.

## Comandos

```powershell
docker stats
docker compose top
docker compose exec backend node -e "console.log(process.memoryUsage())"
docker compose exec postgres psql -U intracorp intracorp_helpdesk -c "SELECT count(*) FROM tickets;"
```

## Practica

1. Abre la vista `Sistema`.
2. Ejecuta la simulacion de respuesta lenta.
3. Revisa si se reflejan sintomas en logs o metricas.

## Criterio de exito

Puedes indicar que servicio consume mas memoria y como lo verificaste.
