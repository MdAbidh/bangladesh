import { Module } from '@nestjs/common';
import { TeacherRequestsController } from './teacher-requests.controller';
import { TeacherRequestsService } from './teacher-requests.service';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [TeacherRequestsController],
  providers: [TeacherRequestsService],
  exports: [TeacherRequestsService],
})
export class TeacherRequestsModule {}
