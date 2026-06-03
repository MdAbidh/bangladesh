import { IsArray, IsUUID, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({ description: 'Array of permission IDs' })
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each permission ID must be valid UUID' })
  @ArrayMinSize(0)
  @IsNotEmpty()
  permissionIds: string[];
}
