# Uptime Kuma - Monitoreo del laboratorio

Este runbook configura Uptime Kuma para monitorear IntraCorp Helpdesk desde dentro de la red Docker.

## Punto clave

Uptime Kuma corre como contenedor dentro de Docker Compose. Por eso, sus monitores deben usar nombres DNS internos de Docker, no `localhost`.

Usar:

```text
http://nginx/health
http://backend:4000/api/health
http://backend:4000/api/health/db
http://nginx/
```

No usar:

```text
http://localhost:8080
http://localhost:4000
http://127.0.0.1
```

Dentro de un contenedor, `localhost` apunta al propio contenedor, no al host ni a otro servicio.

## Acceso

Levantar el stack:

```bash
docker compose up -d
docker compose ps
```

Abrir Uptime Kuma desde el host:

```text
http://localhost:3001
```

Si es la primera vez, crear el usuario administrador inicial desde la pantalla de Uptime Kuma.

## Monitores recomendados

Crear cuatro monitores de tipo `HTTP(s)`.

| Nombre | URL | Objetivo |
| --- | --- | --- |
| IntraCorp - Nginx health | `http://nginx/health` | Verifica que el reverse proxy responda. |
| IntraCorp - API health | `http://backend:4000/api/health` | Verifica que el backend Express este vivo. |
| IntraCorp - DB health | `http://backend:4000/api/health/db` | Verifica que el backend pueda conectar con PostgreSQL. |
| IntraCorp - Web app | `http://nginx/` | Verifica que la entrada principal sirva la app. |

Configuracion sugerida para cada monitor:

```text
Tipo: HTTP(s)
Heartbeat Interval: 60 segundos
Retries: 2
Heartbeat Retry Interval: 20 segundos
Request Timeout: 16 segundos
Accepted Status Codes: 200-299
```

## Paso a paso en la UI

1. Entrar a `http://localhost:3001`.
2. Iniciar sesion como administrador de Uptime Kuma.
3. Presionar `Add New Monitor`.
4. Elegir tipo `HTTP(s)`.
5. Completar `Friendly Name` con el nombre del monitor.
6. Completar `URL` con la URL interna correspondiente.
7. Revisar intervalo, reintentos, timeout y codigos aceptados.
8. Guardar con `Save`.
9. Repetir hasta crear los cuatro monitores.
10. Confirmar que todos queden en estado `Up`.

## Validacion desde Docker

Para comprobar conectividad interna sin depender de la UI, se puede probar desde un contenedor de la misma red:

```bash
docker compose exec nginx sh -lc 'wget -qO- http://nginx/health'
docker compose exec nginx sh -lc 'wget -qO- http://backend:4000/api/health'
docker compose exec nginx sh -lc 'wget -qO- http://backend:4000/api/health/db'
docker compose exec nginx sh -lc 'wget -q --spider http://nginx/'
```

Resultados esperados:

```text
nginx ok
{"status":"ok","service":"intracorp-helpdesk-api",...}
{"status":"ok","database":"reachable",...}
```

El ultimo comando no imprime contenido si responde correctamente; su codigo de salida debe ser `0`.

## Pruebas de incidente

Simular caida del backend:

```bash
docker compose stop backend
```

Monitores afectados esperados:

```text
IntraCorp - API health
IntraCorp - DB health
IntraCorp - Web app
```

Recuperar:

```bash
docker compose start backend
```

Simular caida de PostgreSQL:

```bash
docker compose stop postgres
```

Monitor afectado esperado:

```text
IntraCorp - DB health
```

Recuperar:

```bash
docker compose start postgres
```

## Criterio de exito

- Uptime Kuma abre desde `http://localhost:3001`.
- Los cuatro monitores usan URLs internas de Docker.
- Todos los monitores quedan `Up` con el stack sano.
- Al detener un servicio, el monitor relacionado cambia a `Down`.
- Al recuperar el servicio, el monitor vuelve a `Up`.
