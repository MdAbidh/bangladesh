import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LessonType } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateLessonDto {
  @ApiPropertyOptional({ example: 'Introduction to Variables', description: 'Lesson title' })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @ApiPropertyOptional({ example: 'Learn about variables in JavaScript', description: 'Lesson description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @ApiPropertyOptional({ example: 'Full lesson content here...', description: 'Lesson content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ enum: LessonType, description: 'Lesson type' })
  @IsOptional()
  @IsEnum(LessonType, { message: 'Please provide a valid lesson type' })
  lessonType?: LessonType;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Video ID' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid video ID format' })
  videoId?: string;

  @ApiPropertyOptional({ default: false, description: 'Whether the lesson is free' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFree?: boolean;

  @ApiPropertyOptional({ default: false, description: 'Whether download is allowed' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  allowDownload?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Sort order position' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: 600, description: 'Duration in seconds' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration?: number;
}
