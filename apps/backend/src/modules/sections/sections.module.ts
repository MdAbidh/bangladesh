import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { SectionsRepository } from './sections.repository';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [SectionsController],
  providers: [SectionsService, SectionsRepository],
  exports: [SectionsService],
})
export class SectionsModule {}
