import {
  Controller,
  Get,
  Post,
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
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Bookmarks')
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle a bookmark (create or remove)' })
  @ApiResponse({ status: 201, description: 'Bookmark toggled' })
  async toggle(
    @CurrentUser() user: { sub: string },
    @Body() dto: BookmarkDto,
  ) {
    const data = await this.bookmarksService.toggle(user.sub, dto);
    const message = data.bookmarked ? 'Bookmark added' : 'Bookmark removed';
    return { success: true, message, data };
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my bookmarks' })
  @ApiResponse({ status: 200, description: 'Bookmarks retrieved' })
  async findMyBookmarks(@CurrentUser() user: { sub: string }) {
    const data = await this.bookmarksService.findByUser(user.sub);
    return { success: true, message: 'Bookmarks retrieved successfully', data };
  }

  @Delete(':lessonId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a bookmark by lesson ID' })
  @ApiParam({ name: 'lessonId', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Bookmark removed' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  async remove(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: { sub: string },
  ) {
    await this.bookmarksService.remove(user.sub, lessonId);
    return { success: true, message: 'Bookmark removed successfully', data: null };
  }
}
