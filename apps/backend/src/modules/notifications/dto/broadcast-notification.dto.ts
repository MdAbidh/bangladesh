import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType, UserRole } from '@prisma/client';

export class BroadcastNotificationDto {
  @ApiProperty({ example: 'Platform Announcement', description: 'Notification title' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiProperty({ example: 'Important platform update...', description: 'Notification message' })
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(2000, { message: 'Message must not exceed 2000 characters' })
  message: string;

  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  @IsEnum(NotificationType, { message: 'Invalid notification type' })
  @IsNotEmpty()
  type: NotificationType;

  @ApiPropertyOptional({ enum: UserRole, description: 'Target role (optional, sends to all if omitted)' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Link URL' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
