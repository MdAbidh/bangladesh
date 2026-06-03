import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherRequestDto {
  @ApiPropertyOptional({ example: 'I have 5 years of teaching experience...', description: 'Your biography' })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Bio must not exceed 2000 characters' })
  bio?: string;

  @ApiPropertyOptional({ example: 'Web Development, JavaScript, Python', description: 'Areas of expertise' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Expertise must not exceed 500 characters' })
  expertise?: string;

  @ApiPropertyOptional({ example: 'I want to share my knowledge...', description: 'Reason for becoming a teacher' })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Reason must not exceed 2000 characters' })
  reason?: string;
}
