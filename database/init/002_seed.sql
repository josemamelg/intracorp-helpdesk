INSERT INTO users (name, email, password_hash, role, department)
VALUES
  ('Jose Melgarejo', 'admin@intracorp.local', crypt('Password123!', gen_salt('bf', 12)), 'admin', 'IT Governance'),
  ('Luis Pereira', 'soporte@intracorp.local', crypt('Password123!', gen_salt('bf', 12)), 'soporte', 'Mesa de Ayuda'),
  ('Carla Rojas', 'empleado@intracorp.local', crypt('Password123!', gen_salt('bf', 12)), 'empleado', 'Finanzas'),
  ('Mario Benitez', 'mario.benitez@intracorp.local', crypt('Password123!', gen_salt('bf', 12)), 'empleado', 'Operaciones'),
  ('Noelia Acosta', 'noelia.acosta@intracorp.local', crypt('Password123!', gen_salt('bf', 12)), 'soporte', 'Infraestructura')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tickets (title, description, status, priority, category, created_by, assigned_to, closed_at)
VALUES
  ('VPN no conecta desde fuera de oficina', 'El cliente VPN muestra timeout al validar credenciales desde red domestica.', 'in_progress', 'high', 'Redes', 3, 2, NULL),
  ('Solicitud de acceso a carpeta contable', 'Necesito acceso de lectura a la carpeta compartida FIN-2026 para cierre mensual.', 'open', 'medium', 'Accesos', 3, NULL, NULL),
  ('Laptop con disco casi lleno', 'El equipo muestra alertas de espacio insuficiente y no permite instalar actualizaciones.', 'waiting_user', 'medium', 'Hardware', 4, 5, NULL),
  ('Correo corporativo no sincroniza', 'Outlook no sincroniza correos desde ayer despues del cambio de password.', 'resolved', 'low', 'Correo', 4, 2, NOW() - INTERVAL '1 day'),
  ('Servidor de reportes lento', 'El portal interno de reportes tarda mas de 20 segundos en responder.', 'open', 'critical', 'Aplicaciones', 3, 5, NULL)
ON CONFLICT DO NOTHING;

INSERT INTO ticket_comments (ticket_id, author_id, body, internal)
VALUES
  (1, 3, 'Probado con dos redes distintas. Sigue fallando.', false),
  (1, 2, 'Se revisa perfil VPN y politicas MFA.', true),
  (3, 5, 'Solicitar al usuario captura de uso de disco y lista de aplicaciones pesadas.', true),
  (4, 2, 'Se recreo perfil de Outlook y quedo operativo.', false)
ON CONFLICT DO NOTHING;

INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata)
VALUES
  (1, 'system.seed_loaded', 'system', NULL, '{"source":"database/init/002_seed.sql"}'::jsonb),
  (2, 'ticket.updated', 'ticket', 1, '{"status":"in_progress"}'::jsonb),
  (5, 'ticket.comment_added', 'ticket', 3, '{"internal":true}'::jsonb)
ON CONFLICT DO NOTHING;
