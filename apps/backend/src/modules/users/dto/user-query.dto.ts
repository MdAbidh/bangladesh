import { IsOptional, IsString, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class UserQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Please provide a valid user role' })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter users created after this date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({ description: 'Filter users created before this date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;
}
