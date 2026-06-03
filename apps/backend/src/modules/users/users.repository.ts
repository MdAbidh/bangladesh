import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User, UserRole, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserQueryDto } from './dto/user-query.dto';

const userSelectFields: Prisma.UserSelect = {
  id: true,
  firebaseUid: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  avatarUrl: true,
  phone: true,
  bio: true,
  headline: true,
  role: true,
  isEmailVerified: true,
  isActive: true,
  isTeacherApproved: true,
  lastLoginAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
};

const profileSelectFields: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  avatarUrl: true,
  phone: true,
  bio: true,
  headline: true,
  role: true,
  isEmailVerified: true,
  isActive: true,
  isTeacherApproved: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
};

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    }) as Promise<User | null>;
  }

  async findByIdWithRoles(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: profileSelectFields,
    });
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', role, search, isActive, createdAfter, createdBefore } = query;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (createdAfter || createdBefore) {
      where.createdAt = {};
      if (createdAfter) {
        where.createdAt.gte = new Date(createdAfter);
      }
      if (createdBefore) {
        where.createdAt.lte = new Date(createdBefore);
      }
    }

    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortBy || 'createdAt']: sortOrder || 'desc',
    };

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: userSelectFields,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
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

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      select: userSelectFields,
    }) as Promise<User>;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelectFields,
    }) as Promise<User>;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const data: Prisma.UserUpdateInput = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.displayName !== undefined) data.displayName = dto.displayName;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.bio !== undefined) data.bio = dto.bio;
    if (dto.headline !== undefined) data.headline = dto.headline;

    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelectFields,
    }) as Promise<User>;
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: userSelectFields,
    }) as Promise<User>;
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: userSelectFields,
    }) as Promise<User>;
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: userSelectFields,
    }) as Promise<User>;
  }

  async softDelete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
      select: userSelectFields,
    }) as Promise<User>;
  }

  async countTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async countNewUsersThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });
  }

  async countActiveUsers(): Promise<number> {
    return this.prisma.user.count({
      where: { isActive: true },
    });
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.prisma.user.count({
      where: { role },
    });
  }

  async countUsersInDateRange(start: Date, end: Date): Promise<number> {
    return this.prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
      },
    });
  }

  async findRecentUsers(limit: number = 5) {
    return this.prisma.user.findMany({
      select: userSelectFields,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
