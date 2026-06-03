FROM node:20-alpine AS builder

WORKDIR /app

# Copy from repo root context (apps/backend/package.json)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache tini curl

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:4000/api/v1/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/main"]
