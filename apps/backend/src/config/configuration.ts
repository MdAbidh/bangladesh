export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ah_learning',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'ah-learning',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT, 10) || 2525,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'noreply@ahlearning.com',
    fromName: process.env.SMTP_FROM_NAME || 'A.H Learning',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true,
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  apiPrefix: process.env.API_PREFIX || 'api/v1',
});
