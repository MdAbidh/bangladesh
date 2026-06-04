import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Course, Prisma } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';

const courseListSelect: Prisma.CourseSelect = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  description: true,
  thumbnailUrl: true,
  price: true,
  discountPrice: true,
  currency: true,
  level: true,
  language: true,
  duration: true,
  totalLessons: true,
  totalSections: true,
  totalDuration: true,
  status: true,
  isFree: true,
  isFeatured: true,
  averageRating: true,
  totalRatings: true,
  totalEnrollments: true,
  totalReviews: true,
  popularityScore: true,
  categoryId: true,
  teacherId: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  teacher: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      avatarUrl: true,
      headline: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
};

const courseDetailSelect: Prisma.CourseSelect = {
  ...courseListSelect,
  previewVideoUrl: true,
  requiresApproval: true,
  approvedById: true,
  approvedAt: true,
  publishedAt: true,
  metadata: true,
  sections: {
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      sortOrder: true,
      isPublished: true,
      lessons: {
        where: { deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          lessonType: true,
          sortOrder: true,
          duration: true,
          isFree: true,
          isPublished: true,
        },
      },
    },
  },
};

@Injectable()
export class CoursesRepository {
  private readonly logger = new Logger(CoursesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CourseQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      categoryId,
      level,
      priceMin,
      priceMax,
      search,
      isFree,
    } = query;

    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (level) {
      where.level = level;
    }

    if (isFree !== undefined) {
      where.isFree = isFree;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) {
        where.price.gte = priceMin;
      }
      if (priceMax !== undefined) {
        where.price.lte = priceMax;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.CourseOrderByWithRelationInput = this.buildOrderBy(sortBy, sortOrder);

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        select: courseListSelect,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findFeatured(limit: number = 10) {
    const where: Prisma.CourseWhereInput = {
      isFeatured: true,
      status: 'PUBLISHED',
      deletedAt: null,
    };

    return this.prisma.course.findMany({
      where,
      select: courseListSelect,
      orderBy: { popularityScore: 'desc' },
      take: limit,
    });
  }

  async findPopular(limit: number = 10) {
    return this.prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: courseListSelect,
      orderBy: { popularityScore: 'desc' },
      take: limit,
    });
  }

  async findRecent(limit: number = 10) {
    return this.prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: courseListSelect,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.course.findFirst({
      where: { slug, deletedAt: null },
      select: courseDetailSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      select: courseDetailSelect,
    });
  }

  async findMyCourses(teacherId: string, query: CourseQueryDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.CourseWhereInput = {
      teacherId,
      deletedAt: null,
    };

    const orderBy: Prisma.CourseOrderByWithRelationInput = this.buildOrderBy(sortBy, sortOrder);
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        select: courseListSelect,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({ data }) as Promise<Course>;
  }

  async createWithTags(
    data: Prisma.CourseCreateInput,
    tags?: string[],
  ): Promise<Course> {
    if (!tags || tags.length === 0) {
      return this.create(data);
    }

    const tagRecords = await Promise.all(
      tags.map(async (name) => {
        const slug = this.slugify(name);
        return this.prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name, slug },
        });
      }),
    );

    return this.prisma.course.create({
      data: {
        ...data,
        tags: {
          create: tagRecords.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
    }) as Promise<Course>;
  }

  async update(
    id: string,
    data: Prisma.CourseUpdateInput,
    tags?: string[],
  ): Promise<Course> {
    if (tags !== undefined) {
      const tagRecords = await Promise.all(
        tags.map(async (name) => {
          const slug = this.slugify(name);
          return this.prisma.tag.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
          });
        }),
      );

      const course = await this.prisma.course.update({
        where: { id },
        data: {
          ...data,
          tags: {
            deleteMany: {},
            create: tagRecords.map((tag) => ({
              tag: { connect: { id: tag.id } },
            })),
          },
        },
      });
      return course;
    }

    return this.prisma.course.update({
      where: { id },
      data,
    }) as Promise<Course>;
  }

  async softDelete(id: string): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as Promise<Course>;
  }

  async updatePopularityScore(courseId: string): Promise<void> {
    const [enrollmentCount, ratingAgg] = await Promise.all([
      this.prisma.enrollment.count({
        where: { courseId, status: 'ACTIVE' },
      }),
      this.prisma.courseRating.aggregate({
        where: { courseId },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    const avgRating = ratingAgg._avg.rating || 0;
    const ratingCount = ratingAgg._count;
    const popularityScore = enrollmentCount * 10 + avgRating * ratingCount * 2;

    await this.prisma.course.update({
      where: { id: courseId },
      data: { popularityScore },
    });
  }

  async getCourseStats() {
    const [totalCourses, publishedCourses, draftCourses, pendingCourses, archivedCourses, totalEnrollments, totalRevenue, featuredCourses] =
      await Promise.all([
        this.prisma.course.count({ where: { deletedAt: null } }),
        this.prisma.course.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
        this.prisma.course.count({ where: { status: 'DRAFT', deletedAt: null } }),
        this.prisma.course.count({ where: { status: 'PENDING', deletedAt: null } }),
        this.prisma.course.count({ where: { status: 'ARCHIVED', deletedAt: null } }),
        this.prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
        this.prisma.enrollment.aggregate({
          _count: true,
        }),
        this.prisma.course.count({ where: { isFeatured: true, deletedAt: null } }),
      ]);

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      pendingCourses,
      archivedCourses,
      totalEnrollments,
      featuredCourses,
    };
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

  private buildOrderBy(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ): Prisma.CourseOrderByWithRelationInput {
    const order = sortOrder || 'desc';

    switch (sortBy) {
      case 'popularity':
        return { popularityScore: order };
      case 'rating':
        return { averageRating: order };
      case 'price':
        return { price: order };
      case 'date':
      default:
        return { createdAt: order };
    }
  }
}
