import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ResourcesRepository } from './resources.repository';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(private readonly repository: ResourcesRepository) {}

  async create(dto: { lessonId: string; title: string; firebaseUrl: string; fileName: string; mimeType: string; size: number }) {
    return this.repository.create(dto);
  }

  async findByLesson(lessonId: string) {
    return this.repository.findByLesson(lessonId);
  }

  async remove(id: string) {
    const resource = await this.repository.findById(id);
    if (!resource) throw new NotFoundException('Resource not found');
    return this.repository.softDelete(id);
  }
}
