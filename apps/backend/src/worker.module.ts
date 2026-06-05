import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './database/prisma.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from './logger/logger.module';
import { VideosModule } from './modules/videos/videos.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const password = config.get<string>('REDIS_PASSWORD');
        const connection: {
          host: string;
          port: number;
          password?: string;
          tls?: object;
        } = {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        };
        if (password) {
          connection.password = password;
        }
        if (config.get<string>('REDIS_TLS_ENABLED') === 'true') {
          connection.tls = { rejectUnauthorized: false };
        }
        return { connection };
      },
    }),
    PrismaModule,
    EmailModule,
    LoggerModule,
    VideosModule,
    AnalyticsModule,
  ],
})
export class WorkerModule {}
