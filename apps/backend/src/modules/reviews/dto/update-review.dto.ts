import { IsOptional, IsString, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 'Updated review content', description: 'Review content' })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Content must not exceed 5000 characters' })
  content?: string;

  @ApiPropertyOptional({ example: 4, description: 'Rating from 1 to 5' })
  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating?: number;
}
