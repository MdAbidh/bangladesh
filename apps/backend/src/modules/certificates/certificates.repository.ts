import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const certificateSelect: Prisma.CertificateSelect = {
  id: true,
  title: true,
  description: true,
  certificateUrl: true,
  certificateId: true,
  status: true,
  userId: true,
  courseId: true,
  issuedAt: true,
  expiresAt: true,
  revokedAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
    },
  },
  course: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
};

@Injectable()
export class CertificatesRepository {
  private readonly logger = new Logger(CertificatesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
      select: certificateSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.certificate.findUnique({
      where: { id },
      select: certificateSelect,
    });
  }

  async findByCertificateId(certificateId: string) {
    return this.prisma.certificate.findUnique({
      where: { certificateId },
      select: {
        ...certificateSelect,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
          },
        },
      },
    });
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    return this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: certificateSelect,
    });
  }

  async create(data: Prisma.CertificateCreateInput) {
    return this.prisma.certificate.create({ data, select: certificateSelect });
  }

  async update(id: string, data: Prisma.CertificateUpdateInput) {
    return this.prisma.certificate.update({
      where: { id },
      data,
      select: certificateSelect,
    });
  }
}
