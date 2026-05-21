import express from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { audit } from '../services/auditService.js';

export const ticketsRouter = express.Router();

ticketsRouter.use(authenticate);

const ticketSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string().min(2)
});

const updateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_user', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assignedTo: z.number().int().nullable().optional()
});

const commentSchema = z.object({
  body: z.string().min(2),
  internal: z.boolean().optional().default(false)
});

ticketsRouter.get('/', async (req, res, next) => {
  try {
    const values = [];
    let where = '';

    if (req.user.role === 'empleado') {
      values.push(req.user.id);
      where = 'WHERE t.created_by = $1';
    }

    const { rows } = await query(
      `SELECT t.*, creator.name AS creator_name, assignee.name AS assignee_name
       FROM tickets t
       JOIN users creator ON creator.id = t.created_by
       LEFT JOIN users assignee ON assignee.id = t.assigned_to
       ${where}
       ORDER BY
         CASE t.priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
         t.updated_at DESC`,
      values
    );

    res.json({ tickets: rows });
  } catch (error) {
    next(error);
  }
});

ticketsRouter.post('/', requireRole('empleado', 'soporte', 'admin'), async (req, res, next) => {
  try {
    const payload = ticketSchema.parse(req.body);
    const { rows } = await query(
      `INSERT INTO tickets (title, description, priority, category, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [payload.title, payload.description, payload.priority, payload.category, req.user.id]
    );

    await audit({
      actorId: req.user.id,
      action: 'ticket.created',
      entityType: 'ticket',
      entityId: rows[0].id,
      metadata: { title: payload.title, priority: payload.priority },
      ipAddress: req.ip
    });

    res.status(201).json({ ticket: rows[0] });
  } catch (error) {
    next(error);
  }
});

ticketsRouter.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT t.*, creator.name AS creator_name, assignee.name AS assignee_name
       FROM tickets t
       JOIN users creator ON creator.id = t.created_by
       LEFT JOIN users assignee ON assignee.id = t.assigned_to
       WHERE t.id = $1`,
      [req.params.id]
    );

    const ticket = rows[0];
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    if (req.user.role === 'empleado' && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: 'No puedes ver este ticket' });
    }

    const comments = await query(
      `SELECT c.*, u.name AS author_name, u.role AS author_role
       FROM ticket_comments c
       JOIN users u ON u.id = c.author_id
       WHERE c.ticket_id = $1
         AND ($2::text <> 'empleado' OR c.internal = false)
       ORDER BY c.created_at ASC`,
      [ticket.id, req.user.role]
    );

    return res.json({ ticket, comments: comments.rows });
  } catch (error) {
    return next(error);
  }
});

ticketsRouter.patch('/:id', requireRole('soporte', 'admin'), async (req, res, next) => {
  try {
    const payload = updateSchema.parse(req.body);
    const current = await query('SELECT * FROM tickets WHERE id = $1', [req.params.id]);
    if (!current.rows[0]) return res.status(404).json({ message: 'Ticket no encontrado' });

    const nextStatus = payload.status ?? current.rows[0].status;
    const nextPriority = payload.priority ?? current.rows[0].priority;
    const nextAssignedTo = Object.prototype.hasOwnProperty.call(payload, 'assignedTo')
      ? payload.assignedTo
      : current.rows[0].assigned_to;

    const { rows } = await query(
      `UPDATE tickets
       SET status = $1, priority = $2, assigned_to = $3, updated_at = NOW(),
           closed_at = CASE WHEN $1 IN ('resolved', 'closed') THEN COALESCE(closed_at, NOW()) ELSE NULL END
       WHERE id = $4
       RETURNING *`,
      [nextStatus, nextPriority, nextAssignedTo, req.params.id]
    );

    await audit({
      actorId: req.user.id,
      action: 'ticket.updated',
      entityType: 'ticket',
      entityId: rows[0].id,
      metadata: payload,
      ipAddress: req.ip
    });

    return res.json({ ticket: rows[0] });
  } catch (error) {
    return next(error);
  }
});

ticketsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    const payload = commentSchema.parse(req.body);
    const ticketResult = await query('SELECT * FROM tickets WHERE id = $1', [req.params.id]);
    const ticket = ticketResult.rows[0];
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    if (req.user.role === 'empleado' && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: 'No puedes comentar este ticket' });
    }
    if (payload.internal && req.user.role === 'empleado') {
      return res.status(403).json({ message: 'Los comentarios internos son solo para soporte/admin' });
    }

    const { rows } = await query(
      `INSERT INTO ticket_comments (ticket_id, author_id, body, internal)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [ticket.id, req.user.id, payload.body, payload.internal]
    );

    await query('UPDATE tickets SET updated_at = NOW() WHERE id = $1', [ticket.id]);
    await audit({
      actorId: req.user.id,
      action: 'ticket.comment_added',
      entityType: 'ticket',
      entityId: ticket.id,
      metadata: { internal: payload.internal },
      ipAddress: req.ip
    });

    return res.status(201).json({ comment: rows[0] });
  } catch (error) {
    return next(error);
  }
});
