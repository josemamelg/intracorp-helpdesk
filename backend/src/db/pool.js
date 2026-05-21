import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (error) => {
  logger.error('Unexpected PostgreSQL pool error', { error: error.message });
});

export async function query(text, params = []) {
  const startedAt = Date.now();
  try {
    const result = await pool.query(text, params);
    logger.debug('SQL query executed', { durationMs: Date.now() - startedAt, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('SQL query failed', { error: error.message, text });
    throw error;
  }
}
