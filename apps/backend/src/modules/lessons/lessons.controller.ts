import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Lessons')
@UseGuards(JwtAuthGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lesson (teachers & admin)' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateLessonDto,
  ) {
    const data = await this.lessonsService.create(dto, user.sub);
    return { success: true, message: 'Lesson created successfully', data };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lesson (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonDto,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.lessonsService.update(id, dto, user.sub, user.role);
    return { success: true, message: 'Lesson updated successfully', data };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a lesson (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.lessonsService.softDelete(id, user.sub, user.role);
    return { success: true, message: 'Lesson deleted successfully', data: null };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID with video and resources' })
  @ApiParam({ name: 'id', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user?: { sub: string },
  ) {
    const data = await this.lessonsService.findById(id);

    if (user?.sub) {
      await this.lessonsService.trackWatchHistory(user.sub, id);
    }

    return { success: true, message: 'Lesson retrieved successfully', data };
  }

  @Public()
  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Get lessons for a section' })
  @ApiParam({ name: 'sectionId', type: String, description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Lessons retrieved successfully' })
  async findBySectionId(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    const data = await this.lessonsService.findBySectionId(sectionId);
    return { success: true, message: 'Lessons retrieved successfully', data };
  }

  @Patch(':id/reorder')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder a lesson (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Lesson ID' })
  @ApiResponse({ status: 200, description: 'Lesson reordered successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async reorder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('sortOrder') sortOrder: number,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.lessonsService.reorder(id, sortOrder, user.sub, user.role);
    return { success: true, message: 'Lesson reordered successfully', data };
  }
}
