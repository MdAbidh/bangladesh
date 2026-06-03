import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DiscussionsRepository } from './discussions.repository';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class DiscussionsService {
  private readonly logger = new Logger(DiscussionsService.name);

  constructor(private readonly discussionsRepository: DiscussionsRepository) {}

  async createThread(userId: string, dto: CreateThreadDto) {
    const thread = await this.discussionsRepository.createThread({
      title: dto.title,
      content: dto.content,
      lessonId: dto.lessonId,
      user: { connect: { id: userId } },
      course: { connect: { id: dto.courseId } },
    });
    this.logger.log(`Thread created: ${thread.id} by user ${userId}`);
    return thread;
  }

  async findCourseThreads(courseId: string) {
    return this.discussionsRepository.findThreadsByCourse(courseId);
  }

  async findThreadById(id: string) {
    const thread = await this.discussionsRepository.findThreadById(id);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    return thread;
  }

  async addComment(threadId: string, userId: string, dto: CreateCommentDto) {
    const thread = await this.discussionsRepository.findThreadById(threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const comment = await this.discussionsRepository.createComment({
      content: dto.content,
      parentId: dto.parentId,
      user: { connect: { id: userId } },
      thread: { connect: { id: threadId } },
    });
    this.logger.log(`Comment added: ${comment.id} to thread ${threadId} by user ${userId}`);
    return comment;
  }

  async updateThread(id: string, userId: string, userRole: string, dto: Partial<CreateThreadDto>) {
    const thread = await this.discussionsRepository.findThreadById(id);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (userRole !== 'ADMIN' && thread.userId !== userId) {
      throw new ForbiddenException('You can only update your own threads');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.content !== undefined) data.content = dto.content;

    const updated = await this.discussionsRepository.updateThread(id, data);
    this.logger.log(`Thread updated: ${id} by user ${userId}`);
    return updated;
  }

  async deleteThread(id: string, userId: string, userRole: string) {
    const thread = await this.discussionsRepository.findThreadById(id);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (userRole !== 'ADMIN' && thread.userId !== userId) {
      throw new ForbiddenException('You can only delete your own threads');
    }

    await this.discussionsRepository.deleteThread(id);
    this.logger.log(`Thread deleted: ${id} by user ${userId}`);
  }
}
