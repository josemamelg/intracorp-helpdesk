# SysAdmin Lab: IntraCorp Helpdesk

Este laboratorio esta pensado para practicar como administrador de sistemas de una empresa. Cada desafio tiene objetivo, comandos sugeridos y criterios de exito.

## Escenario

IntraCorp usa un helpdesk interno compuesto por:

- `nginx`: entrada publica en `localhost:8080`.
- `frontend`: interfaz React.
- `backend`: API Express.
- `postgres`: base de datos principal.
- `uptime-kuma`: monitoreo HTTP publicado en `localhost:3001`.

Tu trabajo es mantener el servicio disponible, revisar logs, hacer backups, restaurar datos, diagnosticar caidas y ejecutar mantenimiento.

## Orden recomendado

Si no tienes Docker, empieza por `00-wsl-sin-docker.md`.

1. `01-levantar-app.md`
2. `02-revisar-logs.md`
3. `03-backup-restore.md`
4. `04-admin-manual.md`
5. `05-caida-backend.md`
6. `06-problema-postgres.md`
7. `07-cambiar-puertos.md`
8. `08-recursos.md`
9. `09-mantenimiento.md`
10. `10-incidentes-simulados.md`
11. `11-linux-diagnostico-basico.md`
12. `12-linux-permisos-ejecutables.md`

Practicas complementarias:

- `runbooks/uptime-kuma-monitoring.md`

## Bitacora sugerida

Crea una bitacora personal con:

- Fecha y hora.
- Sintoma observado.
- Servicio afectado.
- Comandos ejecutados.
- Causa raiz.
- Accion correctiva.
- Como prevenirlo.
