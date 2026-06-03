import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const roleSelect: Prisma.RoleSelect = {
  id: true,
  name: true,
  description: true,
  isSystem: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      userRoles: true,
      permissions: true,
    },
  },
};

const roleDetailSelect: Prisma.RoleSelect = {
  ...roleSelect,
  permissions: {
    include: {
      permission: {
        select: {
          id: true,
          name: true,
          resource: true,
          action: true,
          description: true,
        },
      },
    },
  },
};

@Injectable()
export class RolesRepository {
  private readonly logger = new Logger(RolesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      select: roleSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      select: roleDetailSelect,
    });
  }

  async findByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  async create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data, select: roleSelect });
  }

  async update(id: string, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({
      where: { id },
      data,
      select: roleSelect,
    });
  }

  async delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });

      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
          })),
        });
      }
    });

    return this.prisma.role.findUnique({
      where: { id: roleId },
      select: roleDetailSelect,
    });
  }
}
