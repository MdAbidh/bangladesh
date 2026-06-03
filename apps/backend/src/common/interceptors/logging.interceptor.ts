import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const correlationId = uuidv4();
    const userId = request.user?.id || 'anonymous';

    request.correlationId = correlationId;

    const startTime = Date.now();

    this.logger.log(
      `[${correlationId}] → ${method} ${url} - User: ${userId} - IP: ${ip} - UA: ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const elapsed = Date.now() - startTime;
          const { statusCode } = response;

          const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';

          this.logger[logLevel](
            `[${correlationId}] ← ${method} ${url} - ${statusCode} - ${elapsed}ms`,
          );
        },
        error: (error) => {
          const elapsed = Date.now() - startTime;
          this.logger.error(
            `[${correlationId}] ✗ ${method} ${url} - ${error.status || 500} - ${elapsed}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
