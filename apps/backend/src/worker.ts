import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logger = new Logger('Worker');
  const app = await NestFactory.createApplicationContext(WorkerModule);

  logger.log('Background worker started');
  logger.log('Queues: video-processing, email, notifications, analytics, cleanup');

  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received. Shutting down worker gracefully...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received. Shutting down worker gracefully...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
