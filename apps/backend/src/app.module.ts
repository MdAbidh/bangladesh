import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { SectionsModule } from './modules/sections/sections.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { VideosModule } from './modules/videos/videos.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { DiscussionsModule } from './modules/discussions/discussions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { TeacherRequestsModule } from './modules/teacher-requests/teacher-requests.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { StorageModule } from './storage/storage.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from './logger/logger.module';
import { HealthController } from './health.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: null,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('RATE_LIMIT_TTL', 60),
            limit: config.get<number>('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
          // Optional: gracefully handle missing Redis locally
          enableOfflineQueue: false,
          lazyConnect: true,
          retryStrategy: (times: number) => {
            if (times > 3) return null; // stop retrying after 3 attempts
            return Math.min(times * 1000, 3000);
          },
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
        },
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    VideosModule,
    ResourcesModule,
    EnrollmentsModule,
    ProgressModule,
    CertificatesModule,
    AnalyticsModule,
    NotificationsModule,
    SearchModule,
    ReviewsModule,
    BookmarksModule,
    DiscussionsModule,
    CategoriesModule,
    TagsModule,
    TeacherRequestsModule,
    AuditLogsModule,
    RolesModule,
    PermissionsModule,
    RecommendationsModule,
    StorageModule,
    EmailModule,
    LoggerModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
