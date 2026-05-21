import crypto from 'crypto';
import morgan from 'morgan';
import { logger } from '../utils/logger.js';

export function requestContext(req, res, next) {
  req.traceId = crypto.randomUUID();
  res.setHeader('X-Trace-Id', req.traceId);
  next();
}

export const httpLogger = morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim(), { type: 'http' })
  }
});
