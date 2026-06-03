import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateTeacherRequestDto } from './dto/create-teacher-request.dto';

@Injectable()
export class TeacherRequestsService {
  private readonly logger = new Logger(TeacherRequestsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTeacherRequestDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isTeacherApproved: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.TEACHER && user.isTeacherApproved) {
      throw new BadRequestException('You are already a teacher');
    }

    const existing = await this.prisma.teacherRequest.findUnique({
      where: { userId },
    });

    if (existing && existing.status === 'PENDING') {
      throw new ConflictException('You already have a pending teacher request');
    }

    if (existing) {
      const updated = await this.prisma.teacherRequest.update({
        where: { id: existing.id },
        data: {
          bio: dto.bio,
          expertise: dto.expertise,
          reason: dto.reason,
          status: 'PENDING',
          reviewedBy: null,
          reviewedAt: null,
        },
      });
      this.logger.log(`Teacher request re-submitted: ${updated.id} by user ${userId}`);
      return updated;
    }

    const request = await this.prisma.teacherRequest.create({
      data: {
        userId,
        bio: dto.bio,
        expertise: dto.expertise,
        reason: dto.reason,
      },
    });

    this.logger.log(`Teacher request created: ${request.id} by user ${userId}`);
    return request;
  }

  async findAll() {
    return this.prisma.teacherRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async approve(id: string, adminId: string) {
    const request = await this.prisma.teacherRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Teacher request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not in pending status');
    }

    await this.prisma.$transaction([
      this.prisma.teacherRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: request.userId },
        data: {
          role: UserRole.TEACHER,
          isTeacherApproved: true,
        },
      }),
    ]);

    this.logger.log(`Teacher request approved: ${id} by admin ${adminId}`);

    return this.prisma.teacherRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, displayName: true, role: true, isTeacherApproved: true },
        },
      },
    });
  }

  async reject(id: string, adminId: string, reason?: string) {
    const request = await this.prisma.teacherRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Teacher request not found');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request is not in pending status');
    }

    const updated = await this.prisma.teacherRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        metadata: reason ? { rejectionReason: reason } : undefined,
      },
    });

    this.logger.log(`Teacher request rejected: ${id} by admin ${adminId}`);
    return updated;
  }
}
