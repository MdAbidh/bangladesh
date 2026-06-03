import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
