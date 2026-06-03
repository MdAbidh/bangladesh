import { IsString, IsOptional, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BookmarkDto {
  @ApiProperty({ description: 'Lesson ID' })
  @IsUUID('4', { message: 'Invalid lesson ID format' })
  @IsNotEmpty({ message: 'Lesson ID is required' })
  lessonId: string;

  @ApiPropertyOptional({ example: 'Important concept', description: 'Optional note' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Note must not exceed 500 characters' })
  note?: string;
}
