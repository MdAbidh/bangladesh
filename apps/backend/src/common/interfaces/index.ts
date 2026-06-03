import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
  correlationId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error?: {
    name: string;
    messages: string[];
    statusCode: number;
    path: string;
    timestamp: string;
  };
}
