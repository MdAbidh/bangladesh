import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUUID,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiateUploadDto {
  @ApiProperty({ example: 'Introduction to Variables', description: 'Video title' })
  @IsString()
  @IsNotEmpty({ message: 'Video title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiPropertyOptional({ example: 'Learn about variables in JavaScript', description: 'Video description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @ApiProperty({ example: 'lesson-1-intro.mp4', description: 'Original file name with extension' })
  @IsString()
  @IsNotEmpty({ message: 'File name is required' })
  fileName: string;

  @ApiProperty({ example: 'video/mp4', description: 'MIME type of the video file' })
  @IsString()
  @IsNotEmpty({ message: 'MIME type is required' })
  mimeType: string;

  @ApiProperty({ example: 104857600, description: 'File size in bytes' })
  @IsInt()
  @Min(1, { message: 'File size must be greater than 0' })
  size: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Course ID the video belongs to' })
  @IsUUID('4', { message: 'Invalid course ID format' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;
}
