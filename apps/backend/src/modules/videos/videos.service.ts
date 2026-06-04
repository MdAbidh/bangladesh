import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { VideosRepository } from './videos.repository';
import { PrismaService } from '../../database/prisma.service';
import { InitiateUploadDto } from './dto/initiate-upload.dto';
import { UploadChunkDto } from './dto/upload-chunk.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';

const CHUNK_THRESHOLD = 10 * 1024 * 1024;

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  constructor(
    private readonly videosRepository: VideosRepository,
    private readonly prisma: PrismaService,
    @Inject('StorageService') private readonly storageService: any,
    @InjectQueue('video-processing') private readonly videoQueue: Queue,
  ) {}

  async initiateUpload(dto: InitiateUploadDto, userId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: dto.courseId, deletedAt: null },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const video = await this.videosRepository.create({
      title: dto.title,
      description: dto.description ?? '',
      fileName: dto.fileName,
      originalName: dto.fileName,
      mimeType: dto.mimeType,
      size: dto.size,
      status: 'UPLOADING',
      chunkUpload: dto.size > CHUNK_THRESHOLD,
      courseId: dto.courseId,
      uploadedById: userId,
    });

    this.logger.log(`Video upload initiated: ${video.id} by user ${userId}`);
    return { uploadId: video.id, video };
  }

  async uploadChunk(dto: UploadChunkDto) {
    const video = await this.videosRepository.findById(dto.uploadId);
    if (!video) {
      throw new NotFoundException('Upload not found');
    }
    if (video.status !== 'UPLOADING') {
      throw new BadRequestException('Upload is not in progress');
    }

    const chunkPath = `temp/uploads/${dto.uploadId}/chunk_${dto.chunkIndex}`;
    const buffer = Buffer.from(dto.chunkData, 'base64');

    try {
      await this.storageService.uploadBuffer(chunkPath, buffer, {
        contentType: 'application/octet-stream',
      });
    } catch (error) {
      this.logger.error(`Failed to upload chunk ${dto.chunkIndex} for ${dto.uploadId}: ${(error as Error).message}`);
      throw new BadRequestException('Failed to upload chunk');
    }

    await this.videosRepository.update(dto.uploadId, {
      uploadedChunks: { increment: 1 },
      totalChunks: dto.totalChunks,
    });

    const progress = Math.round(((dto.chunkIndex + 1) / dto.totalChunks) * 100);
    return { chunkIndex: dto.chunkIndex, uploaded: true, progress };
  }

  async completeUpload(dto: CompleteUploadDto) {
    const video = await this.videosRepository.findById(dto.uploadId);
    if (!video) {
      throw new NotFoundException('Upload not found');
    }
    if (video.status !== 'UPLOADING') {
      throw new BadRequestException('Upload is not in progress');
    }
    if ((video.uploadedChunks ?? 0) < dto.totalChunks) {
      throw new BadRequestException(
        `Only ${video.uploadedChunks} of ${dto.totalChunks} chunks uploaded. Complete all chunks first.`,
      );
    }

    await this.videosRepository.update(dto.uploadId, { status: 'PROCESSING' });

    await this.videoQueue.add(
      'process-video',
      { videoId: dto.uploadId, totalChunks: dto.totalChunks },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { age: 3600, count: 100 },
        removeOnFail: { age: 86400 },
      },
    );

    this.logger.log(`Video upload completed, queued for processing: ${dto.uploadId}`);
    return { uploadId: dto.uploadId, status: 'PROCESSING', message: 'Video queued for processing' };
  }

  async findByCourseId(courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, deletedAt: null },
      select: { id: true },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.videosRepository.findByCourseId(courseId);
  }

  async findById(id: string) {
    const video = await this.videosRepository.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return video;
  }

  async softDelete(id: string, userId: string, userRole: string) {
    const video = await this.videosRepository.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    if (userRole !== 'ADMIN' && video.uploadedById !== userId) {
      throw new ForbiddenException('You can only delete your own videos');
    }
    await this.videosRepository.softDelete(id);
    this.logger.log(`Video soft-deleted: ${id} by user ${userId}`);
  }

  async getSignedUrl(videoId: string) {
    const video = await this.videosRepository.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    if (video.status !== 'READY') {
      throw new BadRequestException('Video is not ready for streaming');
    }

    if (video.signedUrl && video.signedUrlExpiry && video.signedUrlExpiry > new Date()) {
      return { signedUrl: video.signedUrl, expiresAt: video.signedUrlExpiry };
    }

    const signedUrl = await this.storageService.getSignedUrl(video.firebaseUrl, 3600);
    const expiry = new Date(Date.now() + 3600 * 1000);
    await this.videosRepository.updateSignedUrl(videoId, signedUrl, expiry);

    return { signedUrl, expiresAt: expiry };
  }

  async getStreamUrl(videoId: string) {
    const video = await this.videosRepository.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    if (video.status !== 'READY') {
      throw new BadRequestException('Video is not ready for streaming');
    }

    if (video.hlsUrl) {
      return { streamUrl: video.hlsUrl, type: 'hls' };
    }

    const { signedUrl } = await this.getSignedUrl(videoId);
    return { streamUrl: signedUrl, type: 'direct' };
  }

  async regenerateSignedUrl(videoId: string) {
    const video = await this.videosRepository.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    if (video.status !== 'READY') {
      throw new BadRequestException('Video is not ready');
    }

    const signedUrl = await this.storageService.getSignedUrl(video.firebaseUrl, 3600);
    const expiry = new Date(Date.now() + 3600 * 1000);
    await this.videosRepository.updateSignedUrl(videoId, signedUrl, expiry);

    this.logger.log(`Signed URL regenerated for video: ${videoId}`);
    return { signedUrl, expiresAt: expiry };
  }

  async trackView(videoId: string) {
    const video = await this.videosRepository.findById(videoId);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    try {
      await this.prisma.courseAnalytics.upsert({
        where: { courseId: video.courseId },
        update: { totalViews: { increment: 1 } },
        create: {
          courseId: video.courseId,
          totalViews: 1,
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to track view for video ${videoId}: ${(error as Error).message}`);
    }

    return { success: true };
  }
}
