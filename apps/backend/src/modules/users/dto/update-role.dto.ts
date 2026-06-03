import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateRoleDto {
  @ApiProperty({ enum: UserRole, description: 'New role for the user' })
  @IsEnum(UserRole, { message: 'Please provide a valid user role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}
