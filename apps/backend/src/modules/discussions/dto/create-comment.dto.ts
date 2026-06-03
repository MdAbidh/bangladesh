import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great question! The answer is...', description: 'Comment content' })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(5000, { message: 'Content must not exceed 5000 characters' })
  content: string;

  @ApiPropertyOptional({ description: 'Parent comment ID for replies (optional)' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid parent ID format' })
  parentId?: string;
}
