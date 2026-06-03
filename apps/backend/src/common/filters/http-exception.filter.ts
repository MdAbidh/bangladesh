import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorName = 'InternalServerError';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string | string[]) || exception.message;
        errorName = (resp.error as string) || exception.name;
      }

      errorName = exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      errorName = exception.name;
      stack = exception.stack;
    }

    const errorMessages = Array.isArray(message) ? message : [message];

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${errorName}: ${errorMessages.join(', ')}`,
        stack,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${errorMessages.join(', ')}`);
    }

    const errorResponse = {
      success: false,
      message: errorMessages.join('; '),
      data: null,
      error: {
        name: errorName,
        messages: errorMessages,
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    };

    response.status(status).json(errorResponse);
  }
}
