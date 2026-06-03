import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { PrismaService } from './database/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  private redis: Redis | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const redisHost = this.configService.get<string>('redis.host');
    const redisPort = this.configService.get<number>('redis.port');
    const redisPassword = this.configService.get<string>('redis.password');

    if (redisHost && redisPort) {
      this.redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
      });
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerResponse({ status: 200, description: 'Health check response' })
  async check(): Promise<{
    status: string;
    uptime: number;
    timestamp: string;
    database: { status: string; latency?: number };
    redis: { status: string; latency?: number };
    memory: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
      external: number;
      usagePercent: number;
    };
  }> {
    let dbStatus = 'disconnected';
    let dbLatency: number | undefined;

    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }

    let redisStatus = 'disconnected';
    let redisLatency: number | undefined;

    if (this.redis) {
      try {
        const redisStart = Date.now();
        await this.redis.ping();
        redisLatency = Date.now() - redisStart;
        redisStatus = 'connected';
      } catch {
        redisStatus = 'disconnected';
      }
    }

    const memoryUsage = process.memoryUsage();
    const heapUsedMb = Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100;
    const heapTotalMb = Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100;
    const rssMb = Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100;
    const externalMb = Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100;
    const usagePercent = heapTotalMb > 0 ? Math.round((heapUsedMb / heapTotalMb) * 10000) / 100 : 0;

    const isHealthy = dbStatus === 'connected' && (this.redis ? redisStatus === 'connected' : true);

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: { status: dbStatus, latency: dbLatency },
      redis: { status: redisStatus, latency: redisLatency },
      memory: {
        heapUsed: heapUsedMb,
        heapTotal: heapTotalMb,
        rss: rssMb,
        external: externalMb,
        usagePercent,
      },
    };
  }
}
