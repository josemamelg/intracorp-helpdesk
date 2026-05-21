import express from 'express';
import { query } from '../db/pool.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const auditRouter = express.Router();

auditRouter.use(authenticate, requireRole('admin'));

auditRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*, u.name AS actor_name, u.email AS actor_email
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.actor_id
       ORDER BY a.created_at DESC
       LIMIT 100`
    );
    res.json({ auditLogs: rows });
  } catch (error) {
    next(error);
  }
});
