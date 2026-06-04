import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: SearchQueryDto) {
    const { q = '', type = 'all', page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const results: Record<string, unknown> = {};

    if (type === 'all' || type === 'courses') {
      const [courses, courseTotal] = await Promise.all([
        this.prisma.course.findMany({
          where: {
            status: 'PUBLISHED',
            deletedAt: null,
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { subtitle: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { teacher: { displayName: { contains: q, mode: 'insensitive' } } },
              { category: { name: { contains: q, mode: 'insensitive' } } },
              { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
            ],
          },
          select: {
            id: true,
            title: true,
            slug: true,
            subtitle: true,
            thumbnailUrl: true,
            price: true,
            isFree: true,
            level: true,
            averageRating: true,
            totalEnrollments: true,
            teacher: { select: { id: true, displayName: true, avatarUrl: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
          take: type === 'all' ? 5 : limit,
          orderBy: { popularityScore: 'desc' },
          skip: type === 'all' ? 0 : skip,
        }),
        type === 'all' ? 0 : this.prisma.course.count({
          where: {
            status: 'PUBLISHED',
            deletedAt: null,
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { subtitle: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { teacher: { displayName: { contains: q, mode: 'insensitive' } } },
              { category: { name: { contains: q, mode: 'insensitive' } } },
              { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
            ],
          },
        }),
      ]);
      results.courses = { items: courses, total: courseTotal };
    }

    if (type === 'all' || type === 'users') {
      const users = await this.prisma.user.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { displayName: { contains: q, mode: 'insensitive' } },
            { headline: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatarUrl: true,
          headline: true,
          role: true,
        },
        take: type === 'all' ? 5 : limit,
        skip: type === 'all' ? 0 : skip,
      });
      results.users = { items: users, total: users.length };
    }

    if (type === 'all' || type === 'categories') {
      const categories = await this.prisma.category.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true,
          color: true,
          _count: { select: { courses: true } },
        },
        take: type === 'all' ? 5 : limit,
        skip: type === 'all' ? 0 : skip,
      });
      results.categories = { items: categories, total: categories.length };
    }

    return results;
  }

  async courseSearch(query: SearchQueryDto) {
    const {
      q = '',
      page = 1,
      limit = 10,
      sortBy = 'relevance',
      categoryId,
      level,
      priceMin,
      priceMax,
      isFree,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { subtitle: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { teacher: { displayName: { contains: q, mode: 'insensitive' } } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
        { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (level) {
      where.level = level;
    }

    if (isFree !== undefined) {
      where.isFree = isFree === true;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = Number(priceMin);
      if (priceMax !== undefined) where.price.lte = Number(priceMax);
    }

    let orderBy: any;
    switch (sortBy) {
      case 'popularity':
        orderBy = { popularityScore: 'desc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'date':
        orderBy = { createdAt: 'desc' };
        break;
      case 'relevance':
      default:
        orderBy = { popularityScore: 'desc' };
        break;
    }

    const courseSelect: any = {
      id: true,
      title: true,
      slug: true,
      subtitle: true,
      description: true,
      thumbnailUrl: true,
      price: true,
      discountPrice: true,
      isFree: true,
      level: true,
      language: true,
      duration: true,
      totalLessons: true,
      averageRating: true,
      totalRatings: true,
      totalEnrollments: true,
      popularityScore: true,
      createdAt: true,
      teacher: {
        select: { id: true, displayName: true, avatarUrl: true, headline: true },
      },
      category: {
        select: { id: true, name: true, slug: true },
      },
      tags: {
        select: { tag: { select: { id: true, name: true, slug: true } } },
      },
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        where,
        select: courseSelect,
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
}
