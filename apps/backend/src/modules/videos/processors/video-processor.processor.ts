import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { VideosRepository } from '../videos.repository';
import { PrismaService } from '../../../database/prisma.service';

@Processor('video-processing')
export class VideoProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(
    private readonly videosRepository: VideosRepository,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'process-video':
        return this.handleProcessVideo(job);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async handleProcessVideo(job: Job<{ videoId: string; totalChunks: number }>): Promise<void> {
    const { videoId } = job.data;
    this.logger.log(`Processing video ${videoId} (attempt ${job.attemptsMade + 1})`);

    try {
      const video = await this.videosRepository.findById(videoId);
      if (!video) {
        throw new Error(`Video ${videoId} not found`);
      }

      await this.videosRepository.update(videoId, { status: 'PROCESSING' });

      const metadata: Record<string, any> = {
        format: video.mimeType?.split('/')[1] || 'mp4',
        resolution: '1080p',
        width: 1920,
        height: 1080,
        duration: 0,
      };

      const firebaseUrl = `videos/${video.courseId}/${videoId}/output.mp4`;
      const hlsUrl = `videos/${video.courseId}/${videoId}/hls/master.m3u8`;
      const thumbnailUrl = `videos/${video.courseId}/${videoId}/thumbnail.jpg`;

      await this.videosRepository.update(videoId, {
        status: 'READY',
        firebaseUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${firebaseUrl}`,
        hlsUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${hlsUrl}`,
        thumbnailUrl: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${thumbnailUrl}`,
        format: metadata.format,
        resolution: metadata.resolution,
        width: metadata.width,
        height: metadata.height,
        duration: metadata.duration,
        metadata: metadata,
        uploadedChunks: { set: job.data.totalChunks },
      });

      this.logger.log(`Video ${videoId} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process video ${videoId}: ${(error as Error).message}`, (error as Error).stack);

      await this.videosRepository.update(videoId, { status: 'FAILED' }).catch((updateErr) => {
        this.logger.error(`Failed to update video ${videoId} to FAILED status: ${(updateErr as Error).message}`);
      });

      if (job.attemptsMade < 3) {
        throw error;
      }
    }
  }
}
