import express from 'express';
import { pool, query } from '../db/pool.js';

export const healthRouter = express.Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'intracorp-helpdesk-api',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

healthRouter.get('/db', async (req, res, next) => {
  try {
    const startedAt = Date.now();
    await query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'reachable',
      latencyMs: Date.now() - startedAt,
      pool: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    });
  } catch (error) {
    next(error);
  }
});
