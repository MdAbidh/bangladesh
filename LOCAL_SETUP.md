# 🚀 Local Development Setup Guide

## Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL (local বা Render remote ব্যবহার করতে পারো)
- Redis (optional - না থাকলেও চলবে)

---

## Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd bangladesh
npm install
```

---

## Step 2: Environment Variables

### Backend setup:
```bash
cp apps/backend/.env.example apps/backend/.env
```
`apps/backend/.env` ফাইলে নিজের values দাও।  
(যদি Render DB use করতে চাও, DATABASE_URL already set আছে)

### Frontend setup:
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```
`apps/frontend/.env.local` ফাইলে Firebase keys দাও।

---

## Step 3: Database Setup

```bash
# Prisma migrate (Render DB-এর জন্য)
cd apps/backend
npx prisma migrate deploy

# অথবা local DB-এর জন্য:
npx prisma migrate dev

# Seed data (optional)
npx prisma db seed
```

---

## Step 4: Run Locally

### Option A: Root থেকে (Turborepo)
```bash
# Root directory-তে:
npm run dev
```

### Option B: Separately
```bash
# Terminal 1 - Backend:
cd apps/backend
npm run start:dev

# Terminal 2 - Frontend:
cd apps/frontend
npm run dev
```

---

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1
- API Health: http://localhost:4000/api/v1/health

---

## Redis (Optional)

App locally Redis ছাড়াও চলবে। Email queue-এর জন্য Redis দরকার।

### Redis install করতে চাইলে:

**Windows:**
```bash
# WSL2 এর মধ্যে:
sudo apt-get install redis-server
sudo service redis-server start
```

**Mac:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

Redis না থাকলে email sending queue কাজ করবে না, কিন্তু বাকি সব features কাজ করবে।

---

## Production Deploy (Render)

`render.yaml` already configured। Render dashboard-এ:
1. New → Blueprint → Connect repo
2. Render automatically সব services deploy করবে
3. **Manual env vars set করতে হবে:**
   - `FIREBASE_PRIVATE_KEY`
   - `SMTP_PASSWORD`

