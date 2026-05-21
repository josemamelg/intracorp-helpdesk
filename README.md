# IntraCorp Helpdesk

Sistema interno de tickets para practicar tareas reales de SysAdmin/DevOps: despliegue, reverse proxy, autenticacion, roles, PostgreSQL, logs, backups, health checks, auditoria, monitoreo basico y troubleshooting.

## Arquitectura

```text
Usuario -> Nginx :8080 -> Frontend React
                   -> Backend Express /api -> PostgreSQL
Backend -> logs estructurados -> ./logs/backend
Scripts -> backup/restore -> ./backups
```

## Decisiones tecnicas

- **Node.js + Express**: API simple, observable y facil de depurar con logs y health checks.
- **React + Vite**: frontend rapido para practicar flujos reales sin exceso de complejidad.
- **PostgreSQL**: base robusta para practicar SQL, backups, restore, indices, conexiones y fallos.
- **Docker Compose**: simula servicios separados como en una empresa.
- **Nginx**: reverse proxy unico para frontend y API, ideal para practicar errores de proxy, puertos y headers.
- **JWT + RBAC**: autenticacion con roles `admin`, `soporte` y `empleado`.
- **Winston + Morgan**: logs HTTP y logs de aplicacion en JSON.
- **Auditoria en DB**: login, cambios de tickets, comentarios y usuarios quedan registrados.
- **Health checks**: Docker y endpoints HTTP para diagnosticar estado de servicios.

## Estructura

```text
backend/          API Express, middleware, rutas, logs
frontend/         App React/Vite servida por Nginx
database/init/    Schema y datos semilla de PostgreSQL
nginx/            Reverse proxy principal
scripts/          Backup, restore y operaciones manuales
sysadmin-lab/     Desafios practicos de administracion
logs/             Logs persistidos del backend
backups/          Dumps de PostgreSQL
```

## Requisitos

- Docker
- Docker Compose v2
- PowerShell en Windows, o shell compatible en Linux/macOS

Si no tienes Docker, puedes correrlo directamente en WSL con Node.js, PostgreSQL y Nginx. Mira la seccion **Modo WSL sin Docker**.

## Arranque rapido con Docker

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose ps
```

Abrir:

```text
http://localhost:8080
```

## Modo WSL sin Docker

Este modo sirve si tienes Ubuntu/WSL pero no Docker. Vas a correr cada servicio directamente en Linux:

- PostgreSQL como servicio local.
- Backend Express en `localhost:4000`.
- Frontend Vite en `localhost:5173`.
- Nginx local como reverse proxy en `localhost:8080`.

### 1. Instalar dependencias del sistema

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx
```

Verifica:

```bash
node -v
npm -v
psql --version
nginx -v
```

### 2. Crear base de datos y usuario

```bash
sudo service postgresql start
sudo -u postgres psql
```

Dentro de `psql`:

```sql
CREATE USER intracorp WITH PASSWORD 'intracorp_password';
CREATE DATABASE intracorp_helpdesk OWNER intracorp;
\c intracorp_helpdesk
CREATE EXTENSION IF NOT EXISTS pgcrypto;
\q
```

Inicializa schema y datos:

```bash
psql -h localhost -U intracorp -d intracorp_helpdesk -f database/init/001_schema.sql
psql -h localhost -U intracorp -d intracorp_helpdesk -f database/init/002_seed.sql
```

Cuando pida password, usa:

```text
intracorp_password
```

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env
```

### 4. Instalar dependencias Node

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 5. Levantar backend y frontend

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

### 6. Configurar Nginx local

Desde la raiz del proyecto:

```bash
sudo cp nginx/intracorp-local.conf /etc/nginx/sites-available/intracorp-helpdesk
sudo ln -s /etc/nginx/sites-available/intracorp-helpdesk /etc/nginx/sites-enabled/intracorp-helpdesk
sudo nginx -t
sudo service nginx reload
```

Abrir:

```text
http://localhost:8080
```

Tambien puedes entrar directo al frontend de desarrollo:

```text
http://localhost:5173
```

## Usuarios de prueba

Todos usan la password:

```text
Password123!
```

| Rol | Email |
| --- | --- |
| admin | admin@intracorp.local |
| soporte | soporte@intracorp.local |
| empleado | empleado@intracorp.local |

## Comandos utiles

Ver servicios:

```powershell
docker compose ps
```

Ver logs del proxy:

```powershell
docker compose logs -f nginx
```

Ver logs del backend:

```powershell
docker compose logs -f backend
```

Ver logs de PostgreSQL:

```powershell
docker compose logs -f postgres
```

Probar health checks:

```powershell
curl http://localhost:8080/health
curl http://localhost:8080/api/health
curl http://localhost:8080/api/health/db
```

Entrar a PostgreSQL:

```powershell
docker compose exec postgres psql -U intracorp intracorp_helpdesk
```

Consulta rapida:

```sql
SELECT status, count(*) FROM tickets GROUP BY status;
SELECT role, count(*) FROM users GROUP BY role;
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

## Backup y restore

PowerShell:

```powershell
.\scripts\backup-postgres.ps1
.\scripts\restore-postgres.ps1 .\backups\intracorp-helpdesk-YYYYMMDD-HHMMSS.sql
```

Linux/macOS:

```bash
chmod +x scripts/*.sh
./scripts/backup-postgres.sh
./scripts/restore-postgres.sh ./backups/intracorp-helpdesk-YYYYMMDD-HHMMSS.sql.gz
```

WSL sin Docker:

```bash
chmod +x scripts/*.sh
./scripts/backup-postgres-local.sh
./scripts/restore-postgres-local.sh ./backups/intracorp-helpdesk-local-YYYYMMDD-HHMMSS.sql.gz
```

## Crear un admin manualmente

PowerShell:

```powershell
Get-Content .\scripts\create-admin.sql | docker compose exec -T postgres psql -U intracorp intracorp_helpdesk
```

Luego ingresar con:

```text
admin.manual@intracorp.local
Password123!
```

## Flujo funcional

1. El usuario inicia sesion.
2. El backend valida credenciales contra PostgreSQL.
3. Express devuelve JWT con rol.
4. React muestra vistas segun permisos.
5. Empleados crean tickets y comentan sus casos.
6. Soporte responde, agrega notas internas y cambia estados.
7. Admin gestiona usuarios, ve metricas, auditoria y estado del sistema.
8. Acciones importantes se registran en `audit_logs`.

## Simulacion de errores

Desde la pantalla **Errores** se pueden disparar:

- HTTP 500 controlado.
- Respuesta lenta.
- Error SQL por tabla inexistente.
- Modo mantenimiento.

Tambien puedes practicar fallos reales:

```powershell
docker compose stop backend
docker compose logs -f nginx
docker compose start backend
```

```powershell
docker compose stop postgres
curl http://localhost:8080/api/health/db
docker compose start postgres
```

## Mantenimiento

Recrear todo desde cero:

```powershell
docker compose down -v
docker compose up --build -d
```

Actualizar imagenes base:

```powershell
docker compose pull
docker compose build --no-cache
docker compose up -d
```

## Laboratorio SysAdmin

La carpeta `sysadmin-lab/` contiene desafios guiados para operar la app como si fueras el administrador de sistemas de IntraCorp.
