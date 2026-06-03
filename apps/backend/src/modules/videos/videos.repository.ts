import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const videoListSelect: Prisma.VideoSelect = {
  id: true,
  title: true,
  description: true,
  fileName: true,
  originalName: true,
  mimeType: true,
  size: true,
  duration: true,
  width: true,
  height: true,
  status: true,
  firebaseUrl: true,
  hlsUrl: true,
  thumbnailUrl: true,
  signedUrl: true,
  signedUrlExpiry: true,
  format: true,
  resolution: true,
  chunkUpload: true,
  totalChunks: true,
  uploadedChunks: true,
  metadata: true,
  courseId: true,
  uploadedById: true,
  createdAt: true,
  updatedAt: true,
  course: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  uploadedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      avatarUrl: true,
    },
  },
};

@Injectable()
export class VideosRepository {
  private readonly logger = new Logger(VideosRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VideoCreateInput) {
    return this.prisma.video.create({ data, select: videoListSelect });
  }

  async findById(id: string) {
    return this.prisma.video.findFirst({
      where: { id, deletedAt: null },
      select: videoListSelect,
    });
  }

  async findByCourseId(courseId: string) {
    return this.prisma.video.findMany({
      where: { courseId, deletedAt: null },
      select: videoListSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: string) {
    return this.prisma.video.findMany({
      where: { status: status as Prisma.EnumVideoStatusFilter['equals'], deletedAt: null },
      select: videoListSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.VideoUpdateInput) {
    return this.prisma.video.update({
      where: { id },
      data,
      select: videoListSelect,
    });
  }

  async updateSignedUrl(id: string, signedUrl: string, expiry: Date) {
    return this.prisma.video.update({
      where: { id },
      data: { signedUrl, signedUrlExpiry: expiry },
      select: videoListSelect,
    });
  }

  async softDelete(id: string) {
    return this.prisma.video.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, deletedAt: true },
    });
  }
}
