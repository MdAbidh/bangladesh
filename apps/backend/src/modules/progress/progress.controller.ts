import { Controller, Get, Post, Put, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { TrackProgressDto } from './dto/track-progress.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Progress')
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lesson/:lessonId/track')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Track lesson progress (watch time, position)' })
  @ApiParam({ name: 'lessonId', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 201, description: 'Progress tracked successfully' })
  @ApiResponse({ status: 400, description: 'Not enrolled in course' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async trackProgress(
    @CurrentUser() user: { sub: string },
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() dto: TrackProgressDto,
  ) {
    const data = await this.progressService.trackProgress(user.sub, lessonId, dto);
    return { success: true, message: 'Progress tracked successfully', data };
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course progress for current user' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course progress retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Not enrolled in course' })
  async getCourseProgress(
    @CurrentUser() user: { sub: string },
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const data = await this.progressService.getCourseProgress(user.sub, courseId);
    return { success: true, message: 'Course progress retrieved successfully', data };
  }

  @Get('lesson/:lessonId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lesson progress for current user' })
  @ApiParam({ name: 'lessonId', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson progress retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async getLessonProgress(
    @CurrentUser() user: { sub: string },
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    const data = await this.progressService.getLessonProgress(user.sub, lessonId);
    return { success: true, message: 'Lesson progress retrieved successfully', data };
  }

  @Put('lesson/:lessonId/complete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark lesson as completed' })
  @ApiParam({ name: 'lessonId', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson marked as completed' })
  @ApiResponse({ status: 400, description: 'Not enrolled in course' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async markComplete(
    @CurrentUser() user: { sub: string },
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    const data = await this.progressService.markComplete(user.sub, lessonId);
    return { success: true, message: 'Lesson marked as completed', data };
  }
}
