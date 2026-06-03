import { IsString, IsNotEmpty, IsUUID, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Great course! Very informative.', description: 'Review content' })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(5000, { message: 'Content must not exceed 5000 characters' })
  content: string;

  @ApiProperty({ description: 'Course ID' })
  @IsUUID('4', { message: 'Invalid course ID format' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;
}
