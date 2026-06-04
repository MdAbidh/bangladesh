import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

const notificationSelect: Prisma.NotificationSelect = {
  id: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
  isBroadcast: true,
  link: true,
  imageUrl: true,
  metadata: true,
  userId: true,
  createdAt: true,
  readAt: true,
};

@Injectable()
export class NotificationsRepository {
  private readonly logger = new Logger(NotificationsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: notificationSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
      select: notificationSelect,
    });
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async create(data: Prisma.NotificationCreateInput) {
    return this.prisma.notification.create({ data, select: notificationSelect });
  }

  async createMany(data: Array<{
    title: string;
    message: string;
    type: string;
    isBroadcast: boolean;
    link?: string;
    imageUrl?: string;
    userId: string;
  }>) {
    await this.prisma.notification.createMany({
      data: data.map((d) => ({
        ...d,
        type: d.type as any,
      })),
    });
    return this.prisma.notification.findMany({
      where: { userId: { in: data.map((d) => d.userId) }, createdAt: { gte: new Date(Date.now() - 5000) } },
      orderBy: { createdAt: 'desc' },
      take: data.length,
      select: notificationSelect,
    });
  }

  async update(id: string, data: Prisma.NotificationUpdateInput) {
    return this.prisma.notification.update({
      where: { id },
      data,
      select: notificationSelect,
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }

  async findUsersByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role: role as any, isActive: true, deletedAt: null },
      select: { id: true, email: true },
    });
  }

  async findAllActiveUsers() {
    return this.prisma.user.findMany({
      where: { isActive: true, deletedAt: null },
      select: { id: true, email: true },
    });
  }

  async findUserEmail(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
  }
}
