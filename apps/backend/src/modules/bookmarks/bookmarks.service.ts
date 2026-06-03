import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BookmarksRepository } from './bookmarks.repository';
import { BookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarksService {
  private readonly logger = new Logger(BookmarksService.name);

  constructor(private readonly bookmarksRepository: BookmarksRepository) {}

  async toggle(userId: string, dto: BookmarkDto) {
    const existing = await this.bookmarksRepository.findByUserAndLesson(userId, dto.lessonId);

    if (existing) {
      await this.bookmarksRepository.delete(existing.id);
      this.logger.log(`Bookmark removed: ${existing.id} by user ${userId}`);
      return { bookmarked: false };
    }

    const bookmark = await this.bookmarksRepository.create({
      note: dto.note,
      user: { connect: { id: userId } },
      lesson: { connect: { id: dto.lessonId } },
    });

    this.logger.log(`Bookmark created: ${bookmark.id} by user ${userId}`);
    return { bookmarked: true, data: bookmark };
  }

  async findByUser(userId: string) {
    return this.bookmarksRepository.findByUser(userId);
  }

  async remove(userId: string, lessonId: string) {
    const bookmark = await this.bookmarksRepository.findByUserAndLesson(userId, lessonId);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    await this.bookmarksRepository.delete(bookmark.id);
    this.logger.log(`Bookmark removed: ${bookmark.id} by user ${userId}`);
  }
}
