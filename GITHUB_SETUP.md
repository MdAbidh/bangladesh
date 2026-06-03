# GitHub Actions & Vercel Setup Guide

## Fix "404: NOT_FOUND" Vercel Error

The 404 error means your Vercel project hasn't been created yet. Follow these steps:

### 1. Create Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Go to frontend directory
cd apps/frontend

# Link project (creates a new project on Vercel)
vercel link

# This creates .vercel/project.json with orgId and projectId
```

### 2. Get Vercel Token

- Go to https://vercel.com/account/tokens
- Create a new token
- Copy the token value

### 3. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → Add these secrets:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Token from step 2 |
| `VERCEL_ORG_ID` | From `.vercel/project.json` (or Vercel dashboard) |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` (or Vercel dashboard) |
| `RENDER_API_KEY` | From Render dashboard |
| `RENDER_DEPLOY_HOOK_URL` | From Render web service settings |
| `DATABASE_URL` | Your production PostgreSQL URL |

### 4. Verify Locally

```bash
# Build frontend locally
cd apps/frontend
npm run build

# Build backend locally
cd apps/backend
npm run build
```

## CI/CD Pipeline Behavior

- **Lint & Type Check**: These display warnings but don't block the pipeline
- **Tests**: Run but don't block if tests don't exist yet
- **Build**: Must succeed for deployment to proceed
- **Deploy**: Only runs on push to `main` branch. Skips gracefully if secrets aren't set.
