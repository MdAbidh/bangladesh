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
import { Type } from 'class-transformer';

export class CreateSectionDto {
  @ApiProperty({ example: 'Getting Started', description: 'Section title' })
  @IsString()
  @IsNotEmpty({ message: 'Section title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiPropertyOptional({ example: 'Introduction to the course', description: 'Section description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Course ID' })
  @IsUUID('4', { message: 'Invalid course ID format' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  @ApiPropertyOptional({ example: 1, description: 'Sort order position' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
