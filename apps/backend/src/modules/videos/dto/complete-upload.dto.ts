import { IsString, IsNotEmpty, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteUploadDto {
  @ApiProperty({ description: 'Upload ID returned from initiate upload endpoint' })
  @IsUUID('4', { message: 'Invalid upload ID format' })
  @IsNotEmpty({ message: 'Upload ID is required' })
  uploadId: string;

  @ApiProperty({ example: 10, description: 'Total number of chunks uploaded' })
  @IsInt()
  @Min(1, { message: 'Total chunks must be at least 1' })
  totalChunks: number;
}
