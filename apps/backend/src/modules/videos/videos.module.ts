import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { StorageModule } from '../../storage/storage.module';
import { LoggerModule } from '../../logger/logger.module';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideosRepository } from './videos.repository';
import { VideoProcessor } from './processors/video-processor.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'video-processing' }),
    StorageModule,
    LoggerModule,
  ],
  controllers: [VideosController],
  providers: [VideosService, VideosRepository, VideoProcessor],
  exports: [VideosService],
})
export class VideosModule {}
