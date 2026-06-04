import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CourseStatus } from '@prisma/client';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(query: CourseQueryDto) {
    return this.coursesRepository.findAll(query);
  }

  async findFeatured(limit?: number) {
    return this.coursesRepository.findFeatured(limit);
  }

  async findPopular(limit?: number) {
    return this.coursesRepository.findPopular(limit);
  }

  async findRecent(limit?: number) {
    return this.coursesRepository.findRecent(limit);
  }

  async findBySlug(slug: string) {
    const course = await this.coursesRepository.findBySlug(slug);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findMyCourses(teacherId: string, query: CourseQueryDto) {
    return this.coursesRepository.findMyCourses(teacherId, query);
  }

  async create(dto: CreateCourseDto, teacherId: string) {
    const slug = await this.generateSlug(dto.title);

    const slugData: any = {
      title: dto.title,
      slug,
      subtitle: dto.subtitle,
      description: dto.description,
      categoryId: dto.categoryId,
      level: dto.level,
      language: dto.language,
      price: dto.price ?? 0,
      isFree: dto.isFree ?? false,
      status: CourseStatus.DRAFT,
      teacher: { connect: { id: teacherId } },
    };

    const course = await this.coursesRepository.createWithTags(slugData, dto.tags);
    this.logger.log(`Course created: ${course.id} by teacher ${teacherId}`);
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, userId: string, userRole: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== 'ADMIN' && course.teacherId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.subtitle !== undefined) data.subtitle = dto.subtitle;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.level !== undefined) data.level = dto.level;
    if (dto.language !== undefined) data.language = dto.language;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.isFree !== undefined) data.isFree = dto.isFree;
    if (dto.thumbnailUrl !== undefined) data.thumbnailUrl = dto.thumbnailUrl;
    if (dto.previewVideoUrl !== undefined) data.previewVideoUrl = dto.previewVideoUrl;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;
    if (dto.discountPrice !== undefined) data.discountPrice = dto.discountPrice;

    return this.coursesRepository.update(id, data, dto.tags);
  }

  async updateStatus(id: string, dto: UpdateStatusDto, userId: string, userRole: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== 'ADMIN' && course.teacherId !== userId) {
      throw new ForbiddenException('You can only change status of your own courses');
    }

    const data: any = { status: dto.status };

    if (dto.status === CourseStatus.PUBLISHED) {
      if (course.requiresApproval && userRole !== 'ADMIN') {
        data.status = CourseStatus.PENDING;
      }
      if (!course.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    return this.coursesRepository.update(id, data);
  }

  async approveCourse(id: string, adminId: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== CourseStatus.PENDING) {
      throw new BadRequestException('Course must be in PENDING status to approve');
    }

    return this.coursesRepository.update(id, {
      status: CourseStatus.PUBLISHED,
      approvedBy: { connect: { id: adminId } },
      approvedAt: new Date(),
      publishedAt: course.publishedAt || new Date(),
    } as any);
  }

  async softDelete(id: string, userId: string, userRole: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userRole !== 'ADMIN' && course.teacherId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.coursesRepository.softDelete(id);
    this.logger.log(`Course soft-deleted: ${id} by user ${userId}`);
  }

  private async generateSlug(title: string): Promise<string> {
    const baseSlug = this.slugify(title);
    let slug = baseSlug;
    let counter = 1;

    const course = await this.coursesRepository.findBySlug(slug);
    if (!course) {
      return slug;
    }

    while (true) {
      const testSlug = `${baseSlug}-${counter}`;
      const existing = await this.coursesRepository.findBySlug(testSlug);
      if (!existing) {
        return testSlug;
      }
      counter++;
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
