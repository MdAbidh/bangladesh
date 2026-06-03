import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { BookmarksRepository } from './bookmarks.repository';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [BookmarksController],
  providers: [BookmarksService, BookmarksRepository],
  exports: [BookmarksService],
})
export class BookmarksModule {}
