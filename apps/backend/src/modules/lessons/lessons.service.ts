import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { LessonsRepository } from './lessons.repository';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LessonsService {
  private readonly logger = new Logger(LessonsService.name);

  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateLessonDto, userId: string) {
    await this.validateSectionOwnership(dto.sectionId, userId);

    const maxSortOrder = await this.lessonsRepository.getMaxSortOrder(dto.sectionId);
    const sortOrder = dto.sortOrder ?? maxSortOrder + 1;

    const data: any = {
      title: dto.title,
      description: dto.description,
      content: dto.content,
      lessonType: dto.lessonType ?? 'VIDEO',
      sortOrder,
      duration: dto.duration ?? 0,
      isFree: dto.isFree ?? false,
      allowDownload: dto.allowDownload ?? false,
      section: { connect: { id: dto.sectionId } },
    };

    if (dto.videoId) {
      data.video = { connect: { id: dto.videoId } };
    }

    const lesson = await this.lessonsRepository.create(data);
    await this.updateCourseDuration(lesson.sectionId);

    this.logger.log(`Lesson created: ${lesson.id} in section ${dto.sectionId}`);
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto, userId: string, userRole: string) {
    const lesson = await this.lessonsRepository.findRawById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (userRole !== 'ADMIN') {
      await this.validateSectionOwnership(lesson.sectionId, userId);
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.lessonType !== undefined) data.lessonType = dto.lessonType;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.duration !== undefined) data.duration = dto.duration;
    if (dto.isFree !== undefined) data.isFree = dto.isFree;
    if (dto.allowDownload !== undefined) data.allowDownload = dto.allowDownload;
    if (dto.videoId !== undefined) {
      data.video = dto.videoId ? { connect: { id: dto.videoId } } : { disconnect: true };
    }

    const updated = await this.lessonsRepository.update(id, data);

    if (dto.duration !== undefined) {
      await this.updateCourseDuration(lesson.sectionId);
    }

    this.logger.log(`Lesson updated: ${id}`);
    return updated;
  }

  async softDelete(id: string, userId: string, userRole: string) {
    const lesson = await this.lessonsRepository.findRawById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (userRole !== 'ADMIN') {
      await this.validateSectionOwnership(lesson.sectionId, userId);
    }

    await this.lessonsRepository.softDelete(id);
    await this.updateCourseDuration(lesson.sectionId);

    this.logger.log(`Lesson soft-deleted: ${id}`);
  }

  async findById(id: string) {
    const lesson = await this.lessonsRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async findBySectionId(sectionId: string) {
    return this.lessonsRepository.findBySectionId(sectionId);
  }

  async reorder(id: string, sortOrder: number, userId: string, userRole: string) {
    const lesson = await this.lessonsRepository.findRawById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (userRole !== 'ADMIN') {
      await this.validateSectionOwnership(lesson.sectionId, userId);
    }

    const updated = await this.lessonsRepository.update(id, { sortOrder });
    this.logger.log(`Lesson reordered: ${id} to position ${sortOrder}`);
    return updated;
  }

  async trackWatchHistory(userId: string, lessonId: string) {
    const lesson = await this.lessonsRepository.findRawById(lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const section = await this.prisma.section.findFirst({
      where: { id: lesson.sectionId, deletedAt: null },
      select: { courseId: true },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await this.prisma.watchHistory.upsert({
      where: {
        userId_courseId_lessonId: { userId, courseId: section.courseId, lessonId },
      },
      update: {
        watchedAt: new Date(),
        duration: lesson.duration,
      },
      create: {
        userId,
        lessonId,
        courseId: section.courseId,
        duration: lesson.duration,
      },
    });
  }

  async updateCourseDuration(sectionId: string) {
    const section = await this.prisma.section.findFirst({
      where: { id: sectionId, deletedAt: null },
      select: { courseId: true },
    });

    if (!section) return;

    const [totalDuration, lessonCount] = await Promise.all([
      this.prisma.lesson.aggregate({
        where: {
          section: { courseId: section.courseId, deletedAt: null },
          deletedAt: null,
        },
        _sum: { duration: true },
      }),
      this.prisma.lesson.count({
        where: {
          section: { courseId: section.courseId, deletedAt: null },
          deletedAt: null,
        },
      }),
    ]);

    await this.prisma.course.update({
      where: { id: section.courseId },
      data: {
        totalDuration: totalDuration._sum.duration ?? 0,
        totalLessons: lessonCount,
      },
    });
  }

  private async validateSectionOwnership(sectionId: string, userId: string) {
    const section = await this.prisma.section.findFirst({
      where: { id: sectionId, deletedAt: null },
      select: {
        id: true,
        courseId: true,
        course: {
          select: { teacherId: true },
        },
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    if (section.course.teacherId !== userId) {
      throw new ForbiddenException('You can only manage lessons in your own courses');
    }
  }
}
