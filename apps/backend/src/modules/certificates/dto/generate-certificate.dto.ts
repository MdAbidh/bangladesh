import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCertificateDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID('4', { message: 'Invalid user ID format' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({ description: 'Course ID' })
  @IsUUID('4', { message: 'Invalid course ID format' })
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  @ApiProperty({ example: 'Certificate of Completion', description: 'Certificate title' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiPropertyOptional({ example: 'For completing the Node.js course', description: 'Certificate description' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
