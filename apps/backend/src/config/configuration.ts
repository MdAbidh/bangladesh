export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ah_learning',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'ah-learning',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'ah:',
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
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'noreply@ahlearning.com',
    secure: process.env.SMTP_SECURE === 'true',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
    max: parseInt(process.env.CACHE_MAX, 10) || 100,
  },
  queue: {
    defaultJobOptions: {
      attempts: parseInt(process.env.QUEUE_ATTEMPTS, 10) || 3,
      backoff: {
        type: 'exponential' as const,
        delay: parseInt(process.env.QUEUE_BACKOFF_DELAY, 10) || 5000,
      },
      removeOnComplete: {
        age: parseInt(process.env.QUEUE_REMOVE_ON_COMPLETE_AGE, 10) || 3600,
        count: parseInt(process.env.QUEUE_REMOVE_ON_COMPLETE_COUNT, 10) || 100,
      },
      removeOnFail: {
        age: parseInt(process.env.QUEUE_REMOVE_ON_FAIL_AGE, 10) || 86400,
      },
    },
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    local: {
      path: process.env.STORAGE_LOCAL_PATH || './uploads',
    },
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transports: (process.env.LOG_TRANSPORTS || 'console').split(','),
  },
  apiPrefix: process.env.API_PREFIX || 'api/v1',
});
