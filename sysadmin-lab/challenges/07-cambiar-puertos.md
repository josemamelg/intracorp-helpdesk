# 07 - Cambiar puertos

## Objetivo

Modificar puertos expuestos sin tocar codigo.

## Pasos

1. Edita `.env`.
2. Cambia:

```text
NGINX_PUBLIC_PORT=8090
POSTGRES_PUBLIC_PORT=55432
PUBLIC_URL=http://localhost:8090
```

3. Recrea servicios:

```powershell
docker compose up -d
docker compose ps
```

4. Abre:

```text
http://localhost:8090
```

## Criterio de exito

La app queda disponible en el nuevo puerto.

## Preguntas

- Que puerto usa PostgreSQL dentro de la red Docker?
- Por que cambiar el puerto publico no rompe el backend?
