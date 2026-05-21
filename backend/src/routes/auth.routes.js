import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';
import { audit } from '../services/auditService.js';

export const authRouter = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const { rows } = await query(
      'SELECT id, name, email, role, password_hash, active FROM users WHERE email = $1',
      [credentials.email.toLowerCase()]
    );

    const user = rows[0];
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const validPassword = await bcrypt.compare(credentials.password, user.password_hash);
    if (!validPassword) {
      await audit({
        actorId: user.id,
        action: 'auth.login_failed',
        entityType: 'user',
        entityId: user.id,
        ipAddress: req.ip
      });
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    await audit({
      actorId: user.id,
      action: 'auth.login_success',
      entityType: 'user',
      entityId: user.id,
      ipAddress: req.ip
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});
