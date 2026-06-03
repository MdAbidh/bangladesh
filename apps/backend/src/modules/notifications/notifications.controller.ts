import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async findMyNotifications(@CurrentUser() user: { sub: string }) {
    const data = await this.notificationsService.findByUser(user.sub);
    return { success: true, message: 'Notifications retrieved successfully', data };
  }

  @Get('unread-count')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved' })
  async getUnreadCount(@CurrentUser() user: { sub: string }) {
    const data = await this.notificationsService.getUnreadCount(user.sub);
    return { success: true, message: 'Unread count retrieved', data: { unreadCount: data } };
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', type: String, description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
  ) {
    const data = await this.notificationsService.markAsRead(id, user.sub);
    return { success: true, message: 'Notification marked as read', data };
  }

  @Patch('read-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser() user: { sub: string }) {
    const count = await this.notificationsService.markAllAsRead(user.sub);
    return { success: true, message: `${count} notifications marked as read`, data: { count } };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a notification for a user (admin)' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  async create(
    @Body() dto: CreateNotificationDto,
  ) {
    const data = await this.notificationsService.create(dto);
    return { success: true, message: 'Notification created successfully', data };
  }

  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Broadcast notification to all users or by role (admin)' })
  @ApiResponse({ status: 201, description: 'Broadcast sent' })
  async broadcast(@Body() dto: BroadcastNotificationDto) {
    const count = await this.notificationsService.broadcast(dto);
    return { success: true, message: `Notification broadcast to ${count} users`, data: { recipientCount: count } };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', type: String, description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.notificationsService.delete(id, user.sub, user.role);
    return { success: true, message: 'Notification deleted successfully', data: null };
  }
}
