import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { audit } from '../services/auditService.js';

export const usersRouter = express.Router();

usersRouter.use(authenticate, requireRole('admin'));

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'soporte', 'empleado']),
  department: z.string().optional().default('General')
});

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  role: z.enum(['admin', 'soporte', 'empleado']).optional(),
  department: z.string().optional(),
  active: z.boolean().optional()
});

usersRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, name, email, role, department, active, last_login_at, created_at
       FROM users
       ORDER BY role, name`
    );
    res.json({ users: rows });
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, role, department)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, department, active, created_at`,
      [payload.name, payload.email.toLowerCase(), passwordHash, payload.role, payload.department]
    );

    await audit({
      actorId: req.user.id,
      action: 'user.created',
      entityType: 'user',
      entityId: rows[0].id,
      metadata: { email: rows[0].email, role: rows[0].role },
      ipAddress: req.ip
    });

    res.status(201).json({ user: rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'El email ya existe' });
    }
    return next(error);
  }
});

usersRouter.patch('/:id', async (req, res, next) => {
  try {
    const payload = updateUserSchema.parse(req.body);
    const current = await query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!current.rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });

    const nextUser = {
      name: payload.name ?? current.rows[0].name,
      role: payload.role ?? current.rows[0].role,
      department: payload.department ?? current.rows[0].department,
      active: Object.prototype.hasOwnProperty.call(payload, 'active') ? payload.active : current.rows[0].active
    };

    const { rows } = await query(
      `UPDATE users
       SET name = $1, role = $2, department = $3, active = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, email, role, department, active, last_login_at, created_at`,
      [nextUser.name, nextUser.role, nextUser.department, nextUser.active, req.params.id]
    );

    await audit({
      actorId: req.user.id,
      action: 'user.updated',
      entityType: 'user',
      entityId: rows[0].id,
      metadata: payload,
      ipAddress: req.ip
    });

    return res.json({ user: rows[0] });
  } catch (error) {
    return next(error);
  }
});
