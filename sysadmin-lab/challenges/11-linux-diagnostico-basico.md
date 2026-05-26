# 11 - Linux Essentials: diagnostico basico

## Objetivo

Practicar comandos basicos de Linux usados por un SysAdmin para ubicarse, leer archivos, revisar logs y comprobar servicios.

La meta no es memorizar todo. La meta es reconocer que herramienta sirve para cada pregunta.

## Escenario

Estas en WSL Debian dentro del proyecto IntraCorp Helpdesk.

El stack puede estar levantado con Docker Compose:

```bash
docker compose up -d
```

## Parte 1: ubicarse en el sistema

Pregunta: donde estoy y que hay aca?

```bash
pwd
ls
ls -lah
cd sysadmin-lab
pwd
cd ..
```

Anota:

- Ruta actual.
- Archivos o carpetas importantes.
- Que diferencia viste entre `ls` y `ls -lah`.

## Parte 2: leer archivos sin editarlos

Pregunta: que dice este archivo?

```bash
cat README.md
head README.md
tail README.md
less README.md
```

Anota:

- Cuando conviene `cat`.
- Cuando conviene `head` o `tail`.
- Por que `less` es util con archivos largos.

## Parte 3: buscar texto

Pregunta: donde aparece una palabra o endpoint?

```bash
grep -R "health" .
grep -R "postgres" docker-compose.yml backend nginx scripts
grep -R "error" logs/backend
```

Anota:

- Que archivo define los health checks.
- Donde aparece `postgres`.
- Si hay errores recientes en logs.

## Parte 4: revisar logs

Pregunta: que paso recientemente?

```bash
tail -n 50 logs/backend/app.log
tail -n 50 logs/backend/error.log
docker compose logs backend --tail 50
docker compose logs nginx --tail 50
```

Anota:

- Hora aproximada del evento.
- Servicio afectado.
- Mensaje que te parecio importante.

## Parte 5: procesos, disco y memoria

Pregunta: la maquina tiene recursos?

```bash
ps aux | head
df -h
free -h
```

Anota:

- Cuanto espacio libre hay en disco.
- Cuanta memoria esta disponible.
- Que proceso te llamo la atencion.

## Parte 6: red y endpoints

Pregunta: la app responde?

```bash
ip addr
curl http://localhost:8080/health
curl http://localhost:8080/api/health
curl http://localhost:8080/api/health/db
```

Anota:

- Que endpoint responde por Nginx.
- Que endpoint valida el backend.
- Que endpoint valida la conexion a PostgreSQL.

## Parte 7: conectar Linux con Docker

Pregunta: que ve Docker?

```bash
docker compose ps
docker compose exec nginx sh -lc 'wget -qO- http://nginx/health'
docker compose exec nginx sh -lc 'wget -qO- http://backend:4000/api/health'
docker compose exec nginx sh -lc 'wget -qO- http://backend:4000/api/health/db'
```

Anota:

- Que servicios estan `Up`.
- Que diferencia hay entre `localhost:8080` desde WSL y `http://backend:4000` desde la red Docker.

## Mini incidente opcional

Simula una caida del backend:

```bash
docker compose stop backend
docker compose ps
curl http://localhost:8080/api/health
docker compose logs nginx --tail 30
docker compose start backend
```

Anota:

- Sintoma.
- Comando que confirmo el problema.
- Accion de recuperacion.

## Criterio de exito

La practica esta completa si puedes responder estas preguntas sin mirar una solucion externa:

- Donde estoy parado en el filesystem?
- Como listo archivos con detalles?
- Como leo las ultimas lineas de un log?
- Como busco una palabra dentro del proyecto?
- Como reviso si hay espacio y memoria?
- Como pruebo si la app responde?
- Como veo el estado de contenedores Docker?

## Resumen mental

```text
pwd      -> donde estoy
ls -lah  -> que hay aca
cat      -> mostrar archivo completo
head     -> primeras lineas
tail     -> ultimas lineas
grep     -> buscar texto
ps aux   -> procesos
df -h    -> disco
free -h  -> memoria
ip addr  -> red
curl     -> probar HTTP
docker compose ps -> estado de servicios
```
