import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s'-]+$/, { message: 'First name contains invalid characters' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s'-]+$/, { message: 'Last name contains invalid characters' })
  lastName: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.STUDENT, description: 'User role' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Please provide a valid user role' })
  role?: UserRole = UserRole.STUDENT;
}
