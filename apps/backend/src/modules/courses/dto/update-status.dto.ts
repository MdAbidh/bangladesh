import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CourseStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({ enum: CourseStatus, description: 'New course status' })
  @IsEnum(CourseStatus, { message: 'Please provide a valid course status' })
  @IsNotEmpty({ message: 'Status is required' })
  status: CourseStatus;
}
