-- Ejecutar dentro de PostgreSQL para crear un admin manual.
-- Password inicial: Password123!
-- Comando:
-- Get-Content .\scripts\create-admin.sql | docker compose exec -T postgres psql -U intracorp intracorp_helpdesk

INSERT INTO users (name, email, password_hash, role, department)
VALUES (
  'Admin Manual',
  'admin.manual@intracorp.local',
  crypt('Password123!', gen_salt('bf', 12)),
  'admin',
  'IT Operations'
)
ON CONFLICT (email) DO UPDATE
SET role = 'admin',
    active = true,
    updated_at = NOW();
