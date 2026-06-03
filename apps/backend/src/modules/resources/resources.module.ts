import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { ResourcesRepository } from './resources.repository';
import { StorageModule } from '../../storage/storage.module';

@Module({
  imports: [PrismaModule, LoggerModule, StorageModule],
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourcesRepository],
  exports: [ResourcesService],
})
export class ResourcesModule {}
