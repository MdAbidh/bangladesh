import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'course:create', description: 'Permission name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ example: 'Can create courses', description: 'Permission description' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({ example: 'course', description: 'Resource this permission applies to' })
  @IsString()
  @IsNotEmpty({ message: 'Resource is required' })
  @MaxLength(50, { message: 'Resource must not exceed 50 characters' })
  resource: string;

  @ApiProperty({ example: 'create', description: 'Action on the resource' })
  @IsString()
  @IsNotEmpty({ message: 'Action is required' })
  @MaxLength(50, { message: 'Action must not exceed 50 characters' })
  action: string;
}
