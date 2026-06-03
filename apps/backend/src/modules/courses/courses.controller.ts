import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Courses')
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List courses with pagination, search, and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['popularity', 'rating', 'date', 'price'], description: 'Sort field' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'level', required: false, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'], description: 'Filter by level' })
  @ApiQuery({ name: 'priceMin', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'priceMax', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by title or description' })
  @ApiQuery({ name: 'isFree', required: false, type: Boolean, description: 'Filter free courses' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  async findAll(@Query() query: CourseQueryDto) {
    const result = await this.coursesService.findAll(query);
    return {
      success: true,
      message: 'Courses retrieved successfully',
      data: result.items,
      meta: result.meta,
    };
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured courses' })
  @ApiResponse({ status: 200, description: 'Featured courses retrieved successfully' })
  async findFeatured(@Query('limit') limit?: string) {
    const data = await this.coursesService.findFeatured(limit ? parseInt(limit, 10) : undefined);
    return { success: true, message: 'Featured courses retrieved successfully', data };
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular courses by popularity score' })
  @ApiResponse({ status: 200, description: 'Popular courses retrieved successfully' })
  async findPopular(@Query('limit') limit?: string) {
    const data = await this.coursesService.findPopular(limit ? parseInt(limit, 10) : undefined);
    return { success: true, message: 'Popular courses retrieved successfully', data };
  }

  @Public()
  @Get('recent')
  @ApiOperation({ summary: 'Get recent courses' })
  @ApiResponse({ status: 200, description: 'Recent courses retrieved successfully' })
  async findRecent(@Query('limit') limit?: string) {
    const data = await this.coursesService.findRecent(limit ? parseInt(limit, 10) : undefined);
    return { success: true, message: 'Recent courses retrieved successfully', data };
  }

  @Get('teacher/my-courses')
  @UseGuards(RolesGuard)
  @Roles('TEACHER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my courses (teacher only)' })
  @ApiResponse({ status: 200, description: 'My courses retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findMyCourses(
    @CurrentUser() user: { sub: string },
    @Query() query: CourseQueryDto,
  ) {
    const result = await this.coursesService.findMyCourses(user.sub, query);
    return {
      success: true,
      message: 'My courses retrieved successfully',
      data: result.items,
      meta: result.meta,
    };
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get course by slug with sections and lessons' })
  @ApiParam({ name: 'slug', type: String, description: 'Course slug' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.coursesService.findBySlug(slug);
    return { success: true, message: 'Course retrieved successfully', data };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course (teachers & admin)' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Course with this title already exists' })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateCourseDto,
  ) {
    const data = await this.coursesService.create(dto, user.sub);
    return { success: true, message: 'Course created successfully', data };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.coursesService.update(id, dto, user.sub, user.role);
    return { success: true, message: 'Course updated successfully', data };
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change course status (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.coursesService.updateStatus(id, dto, user.sub, user.role);
    return { success: true, message: 'Course status updated successfully', data };
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a pending course (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course approved successfully' })
  @ApiResponse({ status: 400, description: 'Course is not in pending status' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async approveCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
  ) {
    const data = await this.coursesService.approveCourse(id, user.sub);
    return { success: true, message: 'Course approved successfully', data };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a course (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.coursesService.softDelete(id, user.sub, user.role);
    return { success: true, message: 'Course deleted successfully', data: null };
  }
}
