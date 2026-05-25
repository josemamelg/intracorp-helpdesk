# 2026-05-25 - Practica de redes

## Practica

Revision de red Docker del laboratorio IntraCorp Helpdesk.

## Objetivo

Entender como se comunican los contenedores entre si y diferenciar puertos internos de puertos publicados hacia el host.

## Comandos usados

```bash
docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
docker network ls
docker network inspect intracorp-helpdesk_intracorp_net
```

## Contenedores en la red

La red Docker del proyecto conecta estos servicios:

- `backend`
- `frontend`
- `postgres`
- `nginx`

## IPs internas observadas

Ejemplos observados durante la practica:

```text
backend  -> 172.18.0.5/16
postgres -> 172.18.0.4/16
gateway  -> 172.18.0.1
```

## Aprendizaje importante

Aunque Docker asigna IPs internas, no conviene depender de ellas porque pueden cambiar al recrear contenedores.

Lo correcto es usar los nombres DNS internos de Docker Compose:

```text
backend
frontend
postgres
nginx
```

Por ejemplo, el backend se conecta a PostgreSQL usando:

```text
postgres:5432
```

no usando una IP fija.

## Puertos internos y externos

```text
localhost:8080  -> nginx:80
localhost:55432 -> postgres:5432
```

Dentro de la red Docker:

```text
nginx   -> backend:4000
backend -> postgres:5432
```

## Correccion conceptual

El puerto `8080` lo publica el servicio:

```text
nginx
```

La IP `172.18.0.1` corresponde al gateway de la red Docker, no al servicio que publica la app.

## Resumen

```text
8080 y 55432 son puertos publicados hacia el host.
80, 4000 y 5432 son puertos internos de contenedores.
localhost del host no es lo mismo que localhost dentro de un contenedor.
```

## Pendiente

- Probar DNS interno con `getent hosts`.
- Probar conectividad desde un contenedor hacia otro.
- Simular un problema de red entre Nginx y backend.
