import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
