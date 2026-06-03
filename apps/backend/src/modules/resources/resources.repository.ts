import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ResourcesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { lessonId: string; title: string; firebaseUrl: string; fileName: string; mimeType: string; size: number }) {
    return this.prisma.resource.create({ data: dto as any });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.resource.findMany({ where: { lessonId, deletedAt: null } });
  }

  async findById(id: string) {
    return this.prisma.resource.findUnique({ where: { id } });
  }

  async softDelete(id: string) {
    return this.prisma.resource.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
