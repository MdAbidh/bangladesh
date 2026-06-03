import { IsNotEmpty, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TrackProgressDto {
  @ApiProperty({ example: 120, description: 'Watch time in seconds' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  watchTime: number;

  @ApiProperty({ example: 600, description: 'Total duration in seconds' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration: number;

  @ApiPropertyOptional({ example: 45, description: 'Last playback position in seconds' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lastPosition?: number;

  @ApiPropertyOptional({ default: false, description: 'Mark lesson as completed' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  completed?: boolean;
}
