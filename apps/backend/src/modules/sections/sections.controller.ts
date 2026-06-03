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
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Sections')
@UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new section (teachers & admin)' })
  @ApiResponse({ status: 201, description: 'Section created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateSectionDto,
  ) {
    const data = await this.sectionsService.create(dto, user.sub);
    return { success: true, message: 'Section created successfully', data };
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a section (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.sectionsService.update(id, dto, user.sub, user.role);
    return { success: true, message: 'Section updated successfully', data };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a section (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    await this.sectionsService.softDelete(id, user.sub, user.role);
    return { success: true, message: 'Section deleted successfully', data: null };
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get sections for a course with lessons' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Sections retrieved successfully' })
  async findByCourseId(@Param('courseId', ParseUUIDPipe) courseId: string) {
    const data = await this.sectionsService.findByCourseId(courseId);
    return { success: true, message: 'Sections retrieved successfully', data };
  }

  @Patch(':id/reorder')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder a section (own teacher or admin)' })
  @ApiParam({ name: 'id', type: String, description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section reordered successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  async reorder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('sortOrder') sortOrder: number,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.sectionsService.reorder(id, sortOrder, user.sub, user.role);
    return { success: true, message: 'Section reordered successfully', data };
  }
}
