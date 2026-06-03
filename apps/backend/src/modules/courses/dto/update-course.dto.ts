import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
  Max,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Complete Node.js Course', description: 'Course title' })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @ApiPropertyOptional({ example: 'Learn Node.js from scratch', description: 'Course subtitle' })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'Subtitle must not exceed 300 characters' })
  subtitle?: string;

  @ApiPropertyOptional({ example: 'Comprehensive course covering Node.js...', description: 'Course description' })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Category ID' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid category ID format' })
  categoryId?: string;

  @ApiPropertyOptional({ enum: CourseLevel, description: 'Course difficulty level' })
  @IsOptional()
  @IsEnum(CourseLevel, { message: 'Please provide a valid course level' })
  level?: CourseLevel;

  @ApiPropertyOptional({ example: 'English', description: 'Course language' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Language must not exceed 50 characters' })
  language?: string;

  @ApiPropertyOptional({ example: 49.99, description: 'Course price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @ApiPropertyOptional({ default: false, description: 'Whether the course is free' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFree?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg', description: 'Course thumbnail URL' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/preview.mp4', description: 'Course preview video URL' })
  @IsOptional()
  @IsString()
  previewVideoUrl?: string;

  @ApiPropertyOptional({ default: false, description: 'Whether the course is featured' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 29.99, description: 'Discounted price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Discount price must be a valid number' })
  @Min(0, { message: 'Discount price cannot be negative' })
  discountPrice?: number;

  @ApiPropertyOptional({ example: ['nodejs', 'javascript', 'backend'], description: 'Course tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @MaxLength(50, { each: true, message: 'Each tag must not exceed 50 characters' })
  tags?: string[];
}
