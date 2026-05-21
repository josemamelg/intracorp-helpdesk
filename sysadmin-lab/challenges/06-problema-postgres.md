# 06 - Problema de conexion con PostgreSQL

## Objetivo

Diagnosticar caida de base de datos.

## Simulacion

```powershell
docker compose stop postgres
curl http://localhost:8080/api/health/db
docker compose logs backend --tail 80
```

## Recuperacion

```powershell
docker compose start postgres
docker compose ps
curl http://localhost:8080/api/health/db
```

## Criterio de exito

Puedes identificar errores de conexion en backend y confirmar recuperacion con `/api/health/db`.

## Preguntas

- Que pasa con la app cuando la DB no esta disponible?
- Que alertas configurarias para prevenir indisponibilidad prolongada?
