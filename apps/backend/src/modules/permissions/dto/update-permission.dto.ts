import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiPropertyOptional({ example: 'course:create', description: 'Permission name' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({ description: 'Permission description' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({ example: 'course', description: 'Resource this permission applies to' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Resource must not exceed 50 characters' })
  resource?: string;

  @ApiPropertyOptional({ example: 'create', description: 'Action on the resource' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Action must not exceed 50 characters' })
  action?: string;
}
