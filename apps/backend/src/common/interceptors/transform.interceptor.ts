import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WrappedResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, WrappedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<WrappedResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const messages: Record<number, string> = {
          200: 'Request successful',
          201: 'Resource created successfully',
          202: 'Request accepted',
          204: 'No content',
        };

        return {
          success: statusCode < 400,
          message: messages[statusCode] || 'Request processed',
          data: data ?? null,
        };
      }),
    );
  }
}
