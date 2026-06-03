import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDetail {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  messages: string[];

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  timestamp: string;
}

export class ApiResponseDto<T = unknown> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ nullable: true })
  data: T | null;

  @ApiPropertyOptional({ type: ApiErrorDetail })
  error?: ApiErrorDetail;
}

export class PaginationMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ type: [Object] })
  items: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
