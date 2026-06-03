import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationType } from '@prisma/client';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async findByUser(userId: string) {
    return this.notificationsRepository.findByUser(userId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationsRepository.countUnread(userId);
  }

  async create(dto: CreateNotificationDto) {
    const notification = await this.notificationsRepository.create({
      title: dto.title,
      message: dto.message,
      type: dto.type as NotificationType,
      link: dto.link,
      imageUrl: dto.imageUrl,
      user: { connect: { id: dto.userId } },
    });

    await this.queueEmailNotification(notification);
    return notification;
  }

  async broadcast(dto: BroadcastNotificationDto) {
    let users: Array<{ id: string; email: string }>;

    if (dto.role) {
      users = await this.notificationsRepository.findUsersByRole(dto.role);
    } else {
      users = await this.notificationsRepository.findAllActiveUsers();
    }

    const notifications = await this.notificationsRepository.createMany(
      users.map((user) => ({
        title: dto.title,
        message: dto.message,
        type: dto.type as NotificationType,
        isBroadcast: true,
        link: dto.link,
        imageUrl: dto.imageUrl,
        userId: user.id,
      })),
    );

    for (const notification of notifications) {
      await this.queueEmailNotification(notification);
    }

    this.logger.log(`Broadcast notification sent to ${users.length} users`);
    return users.length;
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationsRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException('You can only mark your own notifications as read');
    }
    return this.notificationsRepository.update(id, { isRead: true, readAt: new Date() });
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationsRepository.markAllAsRead(userId);
    return result.count;
  }

  async delete(id: string, userId: string, userRole: string) {
    const notification = await this.notificationsRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (userRole !== 'ADMIN' && notification.userId !== userId) {
      throw new ForbiddenException('You can only delete your own notifications');
    }
    await this.notificationsRepository.delete(id);
  }

  private async queueEmailNotification(notification: {
    id: string;
    title: string;
    message: string;
    userId: string;
  }) {
    try {
      const user = await this.notificationsRepository.findUserEmail(notification.userId);
      if (user?.email) {
        await this.emailQueue.add('send-notification-email', {
          to: user.email,
          subject: notification.title,
          body: notification.message,
          notificationId: notification.id,
        });
      }
    } catch (error) {
      this.logger.error(`Failed to queue email for notification ${notification.id}: ${(error as Error).message}`);
    }
  }
}
