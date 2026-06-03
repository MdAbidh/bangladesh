import { IsString, IsNotEmpty, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadChunkDto {
  @ApiProperty({ description: 'Upload ID returned from initiate upload endpoint' })
  @IsUUID('4', { message: 'Invalid upload ID format' })
  @IsNotEmpty({ message: 'Upload ID is required' })
  uploadId: string;

  @ApiProperty({ example: 0, description: 'Chunk index (0-based)' })
  @IsInt()
  @Min(0, { message: 'Chunk index must be a non-negative integer' })
  chunkIndex: number;

  @ApiProperty({ description: 'Base64-encoded chunk data' })
  @IsString()
  @IsNotEmpty({ message: 'Chunk data is required' })
  chunkData: string;

  @ApiProperty({ example: 10, description: 'Total number of chunks for this upload' })
  @IsInt()
  @Min(1, { message: 'Total chunks must be at least 1' })
  totalChunks: number;
}
