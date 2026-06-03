import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });

    this.$use(async (params, next) => {
      const models = ['User', 'Course', 'Section', 'Lesson', 'Video', 'Resource', 'Review', 'Discussion', 'Comment', 'Notification', 'Certificate', 'Category', 'Tag'];

      if (models.includes(params.model ?? '')) {
        if (params.action === 'findUnique' || params.action === 'findFirst' || params.action === 'findMany') {
          if (params.args && params.args.where) {
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          } else {
            params.args = { ...params.args, where: { deletedAt: null } };
          }
        }

        if (params.action === 'delete') {
          params.action = 'update';
          params.args.data = { deletedAt: new Date() };
        }

        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data) {
            params.args.data.deletedAt = new Date();
          } else {
            params.args.data = { deletedAt: new Date() };
          }
        }
      }

      return next(params);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected successfully');

    this.$on('query' as never, (event: { query: string; params: string; duration: number }) => {
      this.logger.debug(`Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
