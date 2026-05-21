import { logger } from '../utils/logger.js';

export function notFound(req, res) {
  res.status(404).json({ message: 'Recurso no encontrado' });
}

export function errorHandler(error, req, res, next) {
  if (error.name === 'ZodError') {
    return res.status(400).json({
      message: 'Datos invalidos',
      issues: error.issues
    });
  }

  logger.error('Unhandled API error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    message: error.expose ? error.message : 'Error interno del servidor',
    traceId: req.traceId
  });
}
