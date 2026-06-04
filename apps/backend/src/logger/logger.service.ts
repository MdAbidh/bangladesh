import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { AsyncLocalStorage } from 'async_hooks';

export interface LogContext {
  correlationId?: string;
  context?: string;
  [key: string]: unknown;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;
  private context?: string;
  private static readonly asyncLocalStorage = new AsyncLocalStorage<LogContext>();

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const logLevel = this.configService.get<string>('logger.level', nodeEnv === 'production' ? 'info' : 'debug');
    const transportsConfig = this.configService.get<string>('logger.transports', 'console');
    const transports: winston.transport[] = [];

    if (transportsConfig.includes('console')) {
      transports.push(
        new winston.transports.Console({
          format: nodeEnv === 'production'
            ? winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
              )
            : winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                winston.format.errors({ stack: true }),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, context, correlationId, ...meta }) => {
                  const ctx = context ? `[${context}]` : '';
                  const corrId = correlationId ? ` (${correlationId})` : '';
                  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                  return `${timestamp} ${level} ${ctx}${corrId} ${message}${metaStr}`;
                }),
              ),
        }),
      );
    }

    if (transportsConfig.includes('file')) {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    }

    if (transportsConfig.includes('sentry')) {
      const dsn = this.configService.get<string>('sentry.dsn');
      if (dsn) {
        try {
          const Sentry = require('@sentry/node');
          const sentryTransport = new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          });
          transports.push(sentryTransport);
        } catch (e) {
          // Sentry not installed, skip
          console.warn('Sentry transport configured but @sentry/node is not installed');
        }
      }
    }

    this.logger = winston.createLogger({
      level: logLevel,
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
      },
      transports,
      exitOnError: false,
    });
  }

  setContext(context: string): void {
    this.context = context;
  }

  private getStore(): LogContext {
    return LoggerService.asyncLocalStorage.getStore() || {};
  }

  static runWithContext<T>(context: LogContext, fn: () => T): T {
    return this.asyncLocalStorage.run(context, fn);
  }

  private enrichMeta(meta?: Record<string, unknown>): Record<string, unknown> {
    const store = this.getStore();
    return {
      ...meta,
      ...(store.correlationId ? { correlationId: store.correlationId } : {}),
      ...(this.context ? { context: this.context } : { context: store.context }),
    };
  }

  log(message: string, ...optionalParams: unknown[]): void {
    const meta = this.extractMeta(optionalParams);
    this.logger.info(message, this.enrichMeta(meta));
  }

  error(message: string, ...optionalParams: unknown[]): void {
    const meta = this.extractMetaWithError(optionalParams);
    this.logger.error(message, this.enrichMeta(meta));
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    const meta = this.extractMeta(optionalParams);
    this.logger.warn(message, this.enrichMeta(meta));
  }

  debug(message: string, ...optionalParams: unknown[]): void {
    const meta = this.extractMeta(optionalParams);
    this.logger.debug(message, this.enrichMeta(meta));
  }

  verbose(message: string, ...optionalParams: unknown[]): void {
    const meta = this.extractMeta(optionalParams);
    this.logger.verbose(message, this.enrichMeta(meta));
  }

  private extractMeta(params: unknown[]): Record<string, unknown> | undefined {
    if (params.length === 0) return undefined;
    if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null) {
      return params[0] as Record<string, unknown>;
    }
    return { additionalInfo: params };
  }

  private extractMetaWithError(params: unknown[]): Record<string, unknown> | undefined {
    if (params.length === 0) return undefined;
    const meta: Record<string, unknown> = {};

    for (const param of params) {
      if (param instanceof Error) {
        meta['stack'] = param.stack;
        meta['errorName'] = param.name;
        meta['errorMessage'] = param.message;
      } else if (typeof param === 'object' && param !== null) {
        Object.assign(meta, param as Record<string, unknown>);
      } else {
        meta['additionalInfo'] = meta['additionalInfo'] || [];
        (meta['additionalInfo'] as unknown[]).push(param);
      }
    }

    return Object.keys(meta).length > 0 ? meta : undefined;
  }
}
