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
import { VideosService } from './videos.service';
import { InitiateUploadDto } from './dto/initiate-upload.dto';
import { UploadChunkDto } from './dto/upload-chunk.dto';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Videos')
@UseGuards(JwtAuthGuard)
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate video upload (teachers & admin)' })
  @ApiResponse({ status: 201, description: 'Upload initiated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async initiateUpload(
    @CurrentUser() user: { sub: string },
    @Body() dto: InitiateUploadDto,
  ) {
    const data = await this.videosService.initiateUpload(dto, user.sub);
    return { success: true, message: 'Upload initiated successfully', data };
  }

  @Post('upload/chunk')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a video chunk' })
  @ApiResponse({ status: 201, description: 'Chunk uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed or upload not in progress' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async uploadChunk(@Body() dto: UploadChunkDto) {
    const data = await this.videosService.uploadChunk(dto);
    return { success: true, message: 'Chunk uploaded successfully', data };
  }

  @Post('upload/complete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete chunk upload and queue processing' })
  @ApiResponse({ status: 201, description: 'Upload completed, processing queued' })
  @ApiResponse({ status: 400, description: 'Validation failed or chunks incomplete' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async completeUpload(@Body() dto: CompleteUploadDto) {
    const data = await this.videosService.completeUpload(dto);
    return { success: true, message: 'Upload completed, video queued for processing', data };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get video details by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Video retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.videosService.findById(id);
    return { success: true, message: 'Video retrieved successfully', data };
  }

  @Public()
  @Get('course/:courseId')
  @ApiOperation({ summary: 'List videos for a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Videos retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findByCourseId(@Param('courseId', ParseUUIDPipe) courseId: string) {
    const data = await this.videosService.findByCourseId(courseId);
    return { success: true, message: 'Videos retrieved successfully', data };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a video (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.videosService.softDelete(id, user.sub, user.role);
    return { success: true, message: 'Video deleted successfully', data: null };
  }

  @Post(':id/regenerate-url')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Regenerate signed URL for a video' })
  @ApiParam({ name: 'id', type: String, description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Signed URL regenerated successfully' })
  @ApiResponse({ status: 400, description: 'Video not ready' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async regenerateSignedUrl(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.videosService.regenerateSignedUrl(id);
    return { success: true, message: 'Signed URL regenerated successfully', data };
  }

  @Public()
  @Get(':id/stream')
  @ApiOperation({ summary: 'Get streaming URL for a video' })
  @ApiParam({ name: 'id', type: String, description: 'Video ID' })
  @ApiResponse({ status: 200, description: 'Stream URL retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Video not ready' })
  @ApiResponse({ status: 404, description: 'Video not found' })
  async getStreamUrl(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.videosService.getStreamUrl(id);
    return { success: true, message: 'Stream URL retrieved successfully', data };
  }
}
