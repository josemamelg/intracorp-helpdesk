import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { pool, query } from '../db/pool.js';

export const systemRouter = express.Router();

let maintenanceMode = false;

systemRouter.use(authenticate);

systemRouter.get('/status', async (req, res, next) => {
  try {
    const dbStartedAt = Date.now();
    await query('SELECT 1');
    const memory = process.memoryUsage();

    res.json({
      system: {
        status: maintenanceMode ? 'maintenance' : 'operational',
        api: 'up',
        database: 'up',
        dbLatencyMs: Date.now() - dbStartedAt,
        uptimeSeconds: Math.round(process.uptime()),
        memory: {
          rssMb: Math.round(memory.rss / 1024 / 1024),
          heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024)
        },
        postgresPool: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

systemRouter.post('/maintenance', requireRole('admin'), (req, res) => {
  maintenanceMode = Boolean(req.body.enabled);
  res.json({ maintenanceMode });
});

systemRouter.get('/simulate/error-500', requireRole('admin', 'soporte'), (req, res) => {
  res.status(500).json({ message: 'Error 500 simulado para troubleshooting', code: 'SIMULATED_500' });
});

systemRouter.get('/simulate/slow', requireRole('admin', 'soporte'), async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  res.json({ message: 'Respuesta lenta simulada', latencyMs: 3500 });
});

systemRouter.get('/simulate/db-error', requireRole('admin'), async (req, res, next) => {
  try {
    await query('SELECT * FROM tabla_inexistente_para_practica');
    res.json({ message: 'Esto no deberia responder' });
  } catch (error) {
    next(error);
  }
});
