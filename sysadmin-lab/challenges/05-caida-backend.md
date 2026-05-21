# 05 - Diagnosticar caida del backend

## Objetivo

Detectar que la API no responde y recuperarla.

## Simulacion

```powershell
docker compose stop backend
curl http://localhost:8080/api/health
docker compose ps
docker compose logs nginx --tail 50
```

## Recuperacion

```powershell
docker compose start backend
docker compose ps
curl http://localhost:8080/api/health
```

## Criterio de exito

Identificas que Nginx esta arriba pero no puede conectar con `backend:4000`.

## Preguntas

- Que error devuelve Nginx?
- Como distinguirias fallo de proxy vs fallo de API?
