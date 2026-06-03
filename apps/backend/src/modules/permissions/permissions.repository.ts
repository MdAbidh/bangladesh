import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const permissionSelect: Prisma.PermissionSelect = {
  id: true,
  name: true,
  description: true,
  resource: true,
  action: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: { roles: true },
  },
};

@Injectable()
export class PermissionsRepository {
  private readonly logger = new Logger(PermissionsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: { resource: 'asc' },
      select: permissionSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.permission.findUnique({
      where: { id },
      select: permissionSelect,
    });
  }

  async findByName(name: string) {
    return this.prisma.permission.findUnique({ where: { name } });
  }

  async create(data: Prisma.PermissionCreateInput) {
    return this.prisma.permission.create({ data, select: permissionSelect });
  }

  async update(id: string, data: Prisma.PermissionUpdateInput) {
    return this.prisma.permission.update({
      where: { id },
      data,
      select: permissionSelect,
    });
  }

  async delete(id: string) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
