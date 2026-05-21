import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const { rows } = await query(
      'SELECT id, name, email, role, active FROM users WHERE id = $1',
      [payload.sub]
    );

    if (!rows[0] || !rows[0].active) {
      return res.status(401).json({ message: 'Usuario inactivo o inexistente' });
    }

    req.user = rows[0];
    return next();
  } catch {
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permisos insuficientes' });
    }
    return next();
  };
}
