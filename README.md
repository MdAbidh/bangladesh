# A.H Learning App

Enterprise Learning Management System (LMS) designed to compete with Udemy, Coursera, and Skillshare.

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, NextUI, Mantine, Radix UI, Framer Motion, GSAP, Zustand, Redux Toolkit, TanStack Query, Recharts

**Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis, BullMQ, Firebase Auth, Firebase Storage

**Infrastructure:** Docker, GitHub Actions, Vercel (Frontend), Render (Backend + Worker), Upstash (Redis)

## Architecture

```
├── apps/
│   ├── frontend/          # Next.js 15 App Router
│   │   ├── src/app/       # Pages & Layouts
│   │   ├── src/components/ # UI & Shared Components
│   │   ├── src/lib/       # Utilities & Config
│   │   ├── src/store/     # Zustand & Redux Stores
│   │   ├── src/services/  # API Service Layer
│   │   ├── src/hooks/     # Custom React Hooks
│   │   └── src/types/     # TypeScript Interfaces
│   └── backend/           # NestJS API
│       ├── src/modules/   # Domain Modules (26 modules)
│       ├── src/common/    # Guards, Decorators, Filters
│       ├── src/config/    # Configuration
│       ├── src/database/  # Prisma Service
│       ├── src/email/     # Email Service
│       ├── src/storage/   # Firebase Storage
│       ├── src/logger/    # Structured Logging
│       └── prisma/        # Schema & Migrations
├── packages/
│   ├── ui/               # Shared UI Components
│   ├── shared/           # Shared Utilities
│   ├── types/            # Shared Types
│   └── configs/          # Shared Configs
└── infrastructure/
    ├── docker/           # Docker Configs
    └── github-actions/   # CI/CD Workflows
```

## Features

### Student Portal
- Course browsing with advanced search & filters
- Video streaming with adaptive bitrate (HLS)
- Progress tracking & resume playback
- Bookmarks, notes, and watch history
- Course reviews & ratings
- Certificate generation (PDF)
- Discussion forums
- Personalized recommendations
- Learning statistics & analytics
- Offline progress sync

### Teacher Portal
- Course builder with section/lesson management
- Video upload with chunk upload & processing
- Resource management
- Student analytics & engagement metrics
- Revenue dashboard
- Course performance analytics

### Admin Portal
- User management with RBAC
- Course moderation workflow
- Platform analytics & monitoring
- Audit logs with search & filters
- System metrics & health
- Broadcast notifications
- Role & permission management

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/ah-learning-app.git
cd ah-learning-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start database
cd apps/backend
npx prisma migrate dev
npx prisma db seed

# Start development servers
npm run frontend:dev   # http://localhost:3000
npm run backend:dev    # http://localhost:4000
npm run db:studio      # http://localhost:5555
```

## API Documentation

Once the backend is running:
- Swagger UI: http://localhost:4000/api/docs
- Health Check: http://localhost:4000/api/v1/health

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete production deployment instructions.

## Production Checklist

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for pre-deployment verification.

## Environment Variables

See [.env.example](./.env.example) for all required environment variables.

## License

Private - All Rights Reserved
e318da92cdfb83fcfb501232da2009188fb2c3fff9d63156c885eff5500bdc88fca1e09e75454a1123f233a07d973afa8064d66209a0698f20af936841405727

b161ab44e0680a714fb0b1422f8f1db9204e73165b26d537d464c32c85c09f42395757ae97f8d7c7f14af628cee0362ce92ce26dc062b1660fb502fbbd634709