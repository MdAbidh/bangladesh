import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s'-]+$/, { message: 'First name contains invalid characters' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s'-]+$/, { message: 'Last name contains invalid characters' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Display name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({ example: '+8801712345678', description: 'Phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'Passionate educator and lifelong learner.', description: 'Short biography' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 'Senior Software Engineer at Tech Corp', description: 'Professional headline' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  headline?: string;
}
