import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}
