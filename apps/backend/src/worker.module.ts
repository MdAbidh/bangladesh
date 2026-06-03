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
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    PrismaModule,
    EmailModule,
    LoggerModule,
    VideosModule,
    AnalyticsModule,
  ],
})
export class WorkerModule {}
