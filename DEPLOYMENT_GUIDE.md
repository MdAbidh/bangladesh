# A.H Learning App - Production Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel (Frontend)                        │
│                 https://app.domain.com                       │
│                                                             │
│  Next.js 15 App Router │ Edge Middleware │ ISR │ SSR         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / API Requests
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Render (Backend API)                       │
│                  https://api.domain.com                      │
│                                                             │
│  NestJS │ JWT Auth │ Prisma │ Swagger │ Rate Limit          │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
┌────────▼────────┐ ┌────────▼────────┐ ┌─────────▼─────────┐
│   PostgreSQL    │ │  Redis (Cloud)  │ │  Firebase Storage  │
│  (Render DB)    │ │  (Upstash)      │ │                    │
└─────────────────┘ └─────────────────┘ └───────────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │  BullMQ Workers   │
                                    │  (Render Worker)  │
                                    └───────────────────┘
```

## Prerequisites

- Node.js 20+
- Git
- Vercel account
- Render account
- Firebase account (with billing enabled)
- Upstash or Redis Cloud account
- GitHub account (for CI/CD)
- Domain name (optional but recommended)

## Step 1: Firebase Setup

```bash
1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Enable Authentication:
   - Sign-in providers: Email/Password, Google
4. Create Storage bucket:
   - Set security rules for authenticated access
5. Get Firebase config:
   - Project settings > General > Your apps > Web app
   - Copy firebaseConfig values
6. Generate Admin SDK private key:
   - Project settings > Service accounts > Generate new private key
   - Save as serviceAccountKey.json
```

## Step 2: Database Setup (Render PostgreSQL)

```bash
1. Log in to Render dashboard
2. Create a new PostgreSQL database
3. Note the connection string (Internal Database URL)
4. Enable SSL mode in connection string
```

## Step 3: Redis Setup (Upstash)

```bash
1. Create Upstash account at https://upstash.com
2. Create a new Redis database
3. Note: REST URL, REST Token, Endpoint
4. Configure maxmemory policy: allkeys-lru
```

## Step 4: Backend Deployment (Render)

```bash
1. Push code to GitHub repository
2. In Render dashboard:
   - Create New Web Service
   - Connect GitHub repository
   - Name: ah-learning-api
   - Runtime: Docker
   - Branch: main
   - Build Command: (uses Dockerfile)
   - Health Check Path: /api/v1/health
3. Add all environment variables from .env.example
4. Deploy the service
5. Note the service URL (e.g., https://ah-learning-api.onrender.com)

6. Create a Background Worker:
   - New > Background Worker
   - Name: ah-learning-worker
   - Dockerfile: Dockerfile.worker
   - Same environment variables
```

## Step 5: Frontend Deployment (Vercel)

```bash
1. Install Vercel CLI: npm i -g vercel
2. In the frontend directory:
   cd apps/frontend
   vercel login
   vercel link
3. Configure environment variables in Vercel dashboard:
   - NEXT_PUBLIC_API_URL: https://api.domain.com/api/v1
   - All NEXT_PUBLIC_FIREBASE_* values
4. Deploy: vercel --prod
5. Configure custom domain: app.domain.com
```

## Step 6: CI/CD Pipeline

```bash
1. In GitHub repository Settings > Secrets and variables > Actions:
   Add the following secrets:
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID
   - RENDER_API_KEY
   - RENDER_DEPLOY_HOOK_URL
   - DATABASE_URL (production)
   - All Firebase secrets
   - All SMTP secrets

2. Push to main branch to trigger CI/CD pipeline
```

## Step 7: Domain Configuration

```bash
Frontend (app.domain.com):
  1. In Vercel dashboard > Domains
  2. Add domain: app.domain.com
  3. Update DNS: Add CNAME record pointing to cname.vercel-dns.com

Backend (api.domain.com):
  1. In Render dashboard > Settings > Custom Domain
  2. Add domain: api.domain.com
  3. Update DNS: Add CNAME record pointing to onrender.com URL

SSL:
  - Vercel provides automatic SSL certificates
  - Render provides automatic SSL certificates
  - Ensure HTTPS only
```

## Step 8: Run Database Migrations

```bash
# After backend is deployed, run migrations:
npx prisma migrate deploy

# Seed initial data:
npx prisma db seed

# Or via GitHub Actions CI/CD pipeline on deploy
```

## Step 9: Verify Deployment

```bash
# Test health endpoint
curl https://api.domain.com/api/v1/health

# Test frontend
open https://app.domain.com

# Test API docs
open https://api.domain.com/api/docs

# Test authentication flow
# 1. Register a new user
# 2. Verify email
# 3. Login
# 4. Access dashboard
```

## Monitoring & Maintenance

### Daily Checks
- [ ] Check Sentry for new errors
- [ ] Review application logs
- [ ] Monitor database performance
- [ ] Check Redis cache hit rates
- [ ] Verify background jobs processing

### Weekly Tasks
- [ ] Review audit logs
- [ ] Check for security vulnerabilities
- [ ] Monitor storage usage
- [ ] Review API response times

### Monthly Tasks
- [ ] Database maintenance (VACUUM, ANALYZE)
- [ ] Review and rotate secrets
- [ ] Performance optimization review
- [ ] Update dependencies

## Troubleshooting

### Common Issues

**Issue: Backend health check failing**
- Check environment variables are set correctly
- Verify database connection string
- Check Redis connection
- Review application logs

**Issue: Firebase authentication failing**
- Verify Firebase project is in production mode
- Check Firebase Admin SDK credentials
- Verify authentication providers are enabled

**Issue: Video uploads failing**
- Check Firebase Storage bucket permissions
- Verify file size limits
- Check queue worker is running
- Review video processor logs

**Issue: CORS errors**
- Verify CORS_ORIGINS includes frontend URL
- Check Vercel rewrites configuration
- Ensure credentials are properly configured

## Scaling

### Horizontal Scaling
- Backend: Add more Render web service instances
- Workers: Increase worker count
- Database: Upgrade Render PostgreSQL plan
- Redis: Upgrade Upstash plan

### Performance Optimization
- Enable Redis caching aggressively
- Optimize database queries (add indexes)
- Implement CDN caching for static assets
- Use Edge Middleware for auth checks
- Implement lazy loading for heavy components

## Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Rotate secrets regularly** - JWT secrets, Firebase keys
3. **Monitor access logs** - Use audit log system
4. **Regular security audits** - Check for vulnerabilities
5. **Keep dependencies updated** - Use Dependabot or Renovate
6. **Use principle of least privilege** - RBAC ensures minimal access
7. **Validate all inputs** - Both client and server side
8. **Use HTTPS only** - For all communications
