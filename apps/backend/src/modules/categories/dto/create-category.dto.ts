import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Web Development', description: 'Category name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ example: 'Web development courses', description: 'Category description' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({ example: 'globe', description: 'Icon identifier' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: '#FF5733', description: 'Color hex code' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Parent category ID' })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid parent ID format' })
  parentId?: string;

  @ApiPropertyOptional({ default: 0, description: 'Sort order' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}
