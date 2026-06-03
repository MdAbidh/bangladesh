import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID to notify' })
  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({ example: 'Course Updated', description: 'Notification title' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiProperty({ example: 'The course has been updated with new content', description: 'Notification message' })
  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(2000, { message: 'Message must not exceed 2000 characters' })
  message: string;

  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  @IsEnum(NotificationType, { message: 'Invalid notification type' })
  @IsNotEmpty()
  type: NotificationType;

  @ApiPropertyOptional({ description: 'Link URL' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'Image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
