import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

const auditLogSelect: Prisma.AuditLogSelect = {
  id: true,
  action: true,
  resource: true,
  resourceId: true,
  description: true,
  metadata: true,
  ipAddress: true,
  userAgent: true,
  actorId: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
    },
  },
};

@Injectable()
export class AuditLogsRepository {
  private readonly logger = new Logger(AuditLogsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AuditLogCreateInput) {
    return this.prisma.auditLog.create({
      data,
      select: auditLogSelect,
    });
  }

  async findAll(query: AuditLogQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      action,
      resource,
      actorId,
      startDate,
      endDate,
    } = query;

    const where: Prisma.AuditLogWhereInput = {};

    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (actorId) where.actorId = actorId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const orderBy: Prisma.AuditLogOrderByWithRelationInput = {
      [sortBy || 'createdAt']: sortOrder || 'desc',
    };

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        select: auditLogSelect,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
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
