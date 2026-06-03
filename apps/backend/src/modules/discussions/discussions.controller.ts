import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Discussions')
@UseGuards(JwtAuthGuard)
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post('threads')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a discussion thread' })
  @ApiResponse({ status: 201, description: 'Thread created' })
  async createThread(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateThreadDto,
  ) {
    const data = await this.discussionsService.createThread(user.sub, dto);
    return { success: true, message: 'Thread created successfully', data };
  }

  @Get('course/:courseId/threads')
  @ApiOperation({ summary: 'Get threads for a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Threads retrieved' })
  async findCourseThreads(@Param('courseId', ParseUUIDPipe) courseId: string) {
    const data = await this.discussionsService.findCourseThreads(courseId);
    return { success: true, message: 'Threads retrieved successfully', data };
  }

  @Get('threads/:id')
  @ApiOperation({ summary: 'Get thread details with comments' })
  @ApiParam({ name: 'id', type: String, description: 'Thread ID' })
  @ApiResponse({ status: 200, description: 'Thread retrieved' })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  async findThreadById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.discussionsService.findThreadById(id);
    return { success: true, message: 'Thread retrieved successfully', data };
  }

  @Post('threads/:id/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a thread' })
  @ApiParam({ name: 'id', type: String, description: 'Thread ID' })
  @ApiResponse({ status: 201, description: 'Comment added' })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  async addComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateCommentDto,
  ) {
    const data = await this.discussionsService.addComment(id, user.sub, dto);
    return { success: true, message: 'Comment added successfully', data };
  }

  @Put('threads/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a thread (owner or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Thread ID' })
  @ApiResponse({ status: 200, description: 'Thread updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  async updateThread(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
    @Body() dto: CreateThreadDto,
  ) {
    const data = await this.discussionsService.updateThread(id, user.sub, user.role, dto);
    return { success: true, message: 'Thread updated successfully', data };
  }

  @Delete('threads/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a thread (owner or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Thread ID' })
  @ApiResponse({ status: 200, description: 'Thread deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Thread not found' })
  async deleteThread(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.discussionsService.deleteThread(id, user.sub, user.role);
    return { success: true, message: 'Thread deleted successfully', data: null };
  }
}
