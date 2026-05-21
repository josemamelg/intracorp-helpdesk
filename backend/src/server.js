import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { requestContext, httpLogger } from './middleware/requestContext.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { ticketsRouter } from './routes/tickets.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { auditRouter } from './routes/audit.routes.js';
import { systemRouter } from './routes/system.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestContext);
app.use(httpLogger);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/audit', auditRouter);
app.use('/api/system', systemRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`IntraCorp Helpdesk API listening on port ${env.port}`, {
    nodeEnv: env.nodeEnv
  });
});
