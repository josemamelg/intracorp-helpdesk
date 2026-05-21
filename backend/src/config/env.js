import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.BACKEND_PORT || process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  db: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || 'intracorp_helpdesk',
    user: process.env.POSTGRES_USER || 'intracorp',
    password: process.env.POSTGRES_PASSWORD || 'intracorp_password'
  }
};
