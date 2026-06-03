import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SectionsRepository } from './sections.repository';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SectionsService {
  private readonly logger = new Logger(SectionsService.name);

  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateSectionDto, userId: string) {
    await this.validateCourseOwnership(dto.courseId, userId);

    const maxSortOrder = await this.sectionsRepository.getMaxSortOrder(dto.courseId);
    const sortOrder = dto.sortOrder ?? maxSortOrder + 1;

    const data = await this.sectionsRepository.create({
      title: dto.title,
      description: dto.description,
      sortOrder,
      course: { connect: { id: dto.courseId } },
    });

    await this.updateCourseSectionCount(dto.courseId);

    this.logger.log(`Section created: ${data.id} in course ${dto.courseId}`);
    return data;
  }

  async update(id: string, dto: UpdateSectionDto, userId: string, userRole: string) {
    const section = await this.sectionsRepository.findRawById(id);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (userRole !== 'ADMIN') {
      await this.validateCourseOwnership(section.courseId, userId);
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;

    const updated = await this.sectionsRepository.update(id, data);
    this.logger.log(`Section updated: ${id}`);
    return updated;
  }

  async softDelete(id: string, userId: string, userRole: string) {
    const section = await this.sectionsRepository.findRawById(id);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (userRole !== 'ADMIN') {
      await this.validateCourseOwnership(section.courseId, userId);
    }

    await this.sectionsRepository.softDelete(id);
    await this.updateCourseSectionCount(section.courseId);

    this.logger.log(`Section soft-deleted: ${id}`);
  }

  async findByCourseId(courseId: string) {
    const sections = await this.sectionsRepository.findByCourseId(courseId);
    return sections;
  }

  async reorder(id: string, sortOrder: number, userId: string, userRole: string) {
    const section = await this.sectionsRepository.findRawById(id);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (userRole !== 'ADMIN') {
      await this.validateCourseOwnership(section.courseId, userId);
    }

    const updated = await this.sectionsRepository.update(id, { sortOrder });
    this.logger.log(`Section reordered: ${id} to position ${sortOrder}`);
    return updated;
  }

  private async validateCourseOwnership(courseId: string, userId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, deletedAt: null },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.teacherId !== userId) {
      throw new ForbiddenException('You can only manage sections in your own courses');
    }
  }

  private async updateCourseSectionCount(courseId: string) {
    const count = await this.prisma.section.count({
      where: { courseId, deletedAt: null },
    });
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalSections: count },
    });
  }
}
