import express from 'express';
import { query } from '../db/pool.js';
import { authenticate } from '../middleware/auth.js';

export const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/metrics', async (req, res, next) => {
  try {
    const scopeWhere = req.user.role === 'empleado' ? 'WHERE created_by = $1' : '';
    const params = req.user.role === 'empleado' ? [req.user.id] : [];

    const [status, priority, activeUsers, recentTickets] = await Promise.all([
      query(
        `SELECT status, COUNT(*)::int AS count
         FROM tickets ${scopeWhere}
         GROUP BY status`,
        params
      ),
      query(
        `SELECT priority, COUNT(*)::int AS count
         FROM tickets ${scopeWhere}
         GROUP BY priority`,
        params
      ),
      query('SELECT COUNT(*)::int AS count FROM users WHERE active = true'),
      query(
        `SELECT t.id, t.title, t.status, t.priority, t.updated_at, u.name AS creator_name
         FROM tickets t
         JOIN users u ON u.id = t.created_by
         ${scopeWhere ? 'WHERE t.created_by = $1' : ''}
         ORDER BY t.updated_at DESC
         LIMIT 8`,
        params
      )
    ]);

    const statusMap = Object.fromEntries(status.rows.map((row) => [row.status, row.count]));
    const openTickets = (statusMap.open || 0) + (statusMap.in_progress || 0) + (statusMap.waiting_user || 0);
    const closedTickets = (statusMap.resolved || 0) + (statusMap.closed || 0);

    res.json({
      metrics: {
        openTickets,
        closedTickets,
        byStatus: status.rows,
        byPriority: priority.rows,
        activeUsers: activeUsers.rows[0].count,
        recentTickets: recentTickets.rows
      }
    });
  } catch (error) {
    next(error);
  }
});
