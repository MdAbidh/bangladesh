import { IsOptional, IsString, IsNumber } from 'class-validator';

export class StorageConfig {
  @IsString()
  projectId: string;

  @IsString()
  clientEmail: string;

  @IsString()
  privateKey: string;

  @IsOptional()
  @IsString()
  storageBucket?: string;

  @IsOptional()
  @IsString()
  databaseUrl?: string;

  @IsOptional()
  @IsNumber()
  signedUrlExpiresInMinutes?: number;
}

export const STORAGE_CONFIG_TOKEN = 'STORAGE_CONFIG';
