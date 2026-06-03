import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty({ example: 'Question about lesson 3', description: 'Thread title' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiProperty({ example: 'I have a question about...', description: 'Thread content' })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(10000, { message: 'Content must not exceed 10000 characters' })
  content: string;

  @ApiProperty({ description: 'Course ID' })
  @IsUUID('4', { message: 'Invalid course ID format' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  @ApiPropertyOptional({ description: 'Lesson ID (optional)' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid lesson ID format' })
  lessonId?: string;
}
