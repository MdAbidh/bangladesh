# A.H Learning App - Production Readiness Checklist

## Pre-Deployment Verification

### Security
- [ ] All secrets stored in environment variables (never in code)
- [ ] Firebase service account key secured (not in repository)
- [ ] JWT_SECRET and JWT_REFRESH_SECRET are strong random values
- [ ] CORS origins configured to allow only frontend domain
- [ ] Rate limiting enabled (ThrottlerGuard)
- [ ] Helmet.js security headers enabled
- [ ] SQL injection protection via Prisma (parameterized queries)
- [ ] XSS protection via Helmet and DOMPurify
- [ ] CSRF protection via SameSite cookies
- [ ] File upload validation (type, size, content check)
- [ ] Firebase Storage security rules configured
- [ ] HTTPS enforced on all endpoints
- [ ] Input validation on all API endpoints (class-validator)
- [ ] RBAC guards on all protected routes

### Database
- [ ] PostgreSQL connection pooling configured
- [ ] Prisma migrations run against production database
- [ ] Database backup strategy in place (automated daily)
- [ ] Database indexes created for query performance
- [ ] Soft delete implemented on all entities
- [ ] Connection string uses SSL mode

### Backend (Render)
- [ ] Dockerfile optimized for production (multi-stage build)
- [ ] Health check endpoint configured (/api/v1/health)
- [ ] Graceful shutdown implemented
- [ ] Environment variables validated on startup
- [ ] CORS configured for production frontend URL
- [ ] API versioning implemented (/api/v1/)
- [ ] Swagger docs disabled in production (optional)
- [ ] Log level set to 'info' or 'warn'
- [ ] Sentry DSN configured for error tracking
- [ ] Worker service configured for background jobs
- [ ] Redis connection configured (Upstash/Redis Cloud)

### Frontend (Vercel)
- [ ] NEXT_PUBLIC_API_URL points to production API
- [ ] Firebase client SDK configured for production project
- [ ] Image optimization enabled (next/image)
- [ ] Dynamic imports for code splitting
- [ ] Lazy loading for below-fold content
- [ ] Edge middleware configured for auth
- [ ] Static page generation where possible
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured (app.domain.com)
- [ ] SSL/TLS enabled (default on Vercel)
- [ ] Analytics monitoring configured (Vercel Analytics)

### Firebase
- [ ] Firebase project set to production mode
- [ ] Authentication providers configured (Email/Password, Google)
- [ ] Storage security rules restrict access
- [ ] Firebase Storage bucket created and configured
- [ ] Firebase Admin SDK initialized on backend

### CI/CD (GitHub Actions)
- [ ] Secrets configured in GitHub repository
- [ ] VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID set
- [ ] RENDER_API_KEY and RENDER_DEPLOY_HOOK_URL set
- [ ] DATABASE_URL secret configured for migrations
- [ ] Test database service configured in CI
- [ ] Coverage thresholds configured

### Monitoring & Observability
- [ ] Sentry configured for error tracking (frontend + backend)
- [ ] Structured logging with correlation IDs
- [ ] Audit logging for all critical operations
- [ ] Performance monitoring (Vercel Analytics, Sentry Performance)
- [ ] Uptime monitoring configured (e.g., UptimeRobot)

## Deployment Steps

### 1. Database
```bash
# Run migrations
cd apps/backend
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### 2. Backend
```bash
# Build Docker image
docker build -t ah-learning-api:latest .

# Push to container registry
docker push registry/ah-learning-api:latest

# Or deploy via Render dashboard
```

### 3. Frontend
```bash
# Build for production
cd apps/frontend
npm run build

# Deploy to Vercel
vercel --prod
```

### 4. Background Worker
```bash
# Deploy worker service
docker build -f Dockerfile.worker -t ah-learning-worker:latest .
```

## Post-Deployment Verification

- [ ] API health endpoint returns 200
- [ ] Frontend loads without errors
- [ ] User registration and login works
- [ ] Email verification flow works
- [ ] Course creation and publishing works
- [ ] Video upload and processing works
- [ ] Student enrollment and progress tracking works
- [ ] Certificate generation works
- [ ] Search functionality works
- [ ] Admin dashboard loads correctly
- [ ] Background jobs processing correctly
- [ ] Notifications being delivered
- [ ] Redis caching working (check cache hit rates)
- [ ] Database query performance acceptable
- [ ] Sentry reporting errors correctly
- [ ] SSL certificates valid
- [ ] Custom domain resolving correctly

## Scaling Considerations

- [ ] Database connection pooling configured
- [ ] Redis caching strategy in place
- [ ] CDN enabled for static assets (Vercel Edge Network)
- [ ] CDN enabled for video content (Firebase CDN)
- [ ] API rate limiting configured
- [ ] Horizontal scaling supported (stateless design)
- [ ] Background jobs processed asynchronously
- [ ] Database indexes optimized for query patterns

## Emergency Procedures

- [ ] Database rollback strategy documented
- [ ] Feature flags for quick rollback
- [ ] Monitoring alerts configured
- [ ] On-call rotation established
- [ ] Runbook for common incidents

## Performance Targets

- [ ] Lighthouse score: 90+ (Performance)
- [ ] Lighthouse score: 90+ (Accessibility)
- [ ] Lighthouse score: 90+ (Best Practices)
- [ ] Lighthouse score: 90+ (SEO)
- [ ] API response time: < 200ms (p95)
- [ ] Page load time: < 2s
- [ ] Time to Interactive: < 3s
- [ ] First Contentful Paint: < 1.5s
