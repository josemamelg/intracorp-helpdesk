# 00 - WSL sin Docker

## Objetivo

Levantar IntraCorp Helpdesk sin Docker, usando servicios locales dentro de WSL.

## Servicios

- PostgreSQL local en `localhost:5432`.
- Backend Express en `localhost:4000`.
- Frontend Vite en `localhost:5173`.
- Nginx local en `localhost:8080`.

## Instalacion

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx
```

## Base de datos

```bash
sudo service postgresql start
sudo -u postgres psql
```

```sql
CREATE USER intracorp WITH PASSWORD 'intracorp_password';
CREATE DATABASE intracorp_helpdesk OWNER intracorp;
\c intracorp_helpdesk
CREATE EXTENSION IF NOT EXISTS pgcrypto;
\q
```

```bash
psql -h localhost -U intracorp -d intracorp_helpdesk -f database/init/001_schema.sql
psql -h localhost -U intracorp -d intracorp_helpdesk -f database/init/002_seed.sql
```

## App

```bash
cp .env.local.example .env
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

## Nginx

```bash
sudo cp nginx/intracorp-local.conf /etc/nginx/sites-available/intracorp-helpdesk
sudo ln -s /etc/nginx/sites-available/intracorp-helpdesk /etc/nginx/sites-enabled/intracorp-helpdesk
sudo nginx -t
sudo service nginx reload
```

## Validacion

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/health
curl http://localhost:8080/api/health/db
```

## Criterio de exito

Puedes iniciar sesion en `http://localhost:8080` con:

```text
admin@intracorp.local
Password123!
```
