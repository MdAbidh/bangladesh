import { Module } from '@nestjs/common';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';
import { DiscussionsRepository } from './discussions.repository';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [DiscussionsController],
  providers: [DiscussionsService, DiscussionsRepository],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
