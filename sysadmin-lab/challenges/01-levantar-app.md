# 01 - Levantar la app

## Objetivo

Desplegar todo el entorno y comprobar que los servicios estan sanos.

## Comandos

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
curl http://localhost:8080/health
curl http://localhost:8080/api/health
curl http://localhost:8080/api/health/db
```

## Criterio de exito

- `nginx`, `frontend`, `backend` y `postgres` aparecen `running` o `healthy`.
- Puedes abrir `http://localhost:8080`.
- Puedes iniciar sesion con `admin@intracorp.local` y `Password123!`.

## Preguntas

- Que servicio expone el puerto publico?
- Por que el backend no publica su puerto directamente?
- Donde se inicializa la base de datos?
