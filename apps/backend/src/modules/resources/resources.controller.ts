import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResourcesService } from './resources.service';

@ApiTags('Resources')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a resource file' })
  async create(@Body() dto: { lessonId: string; title: string; firebaseUrl: string; fileName: string; mimeType: string; size: number }) {
    return this.resourcesService.create(dto);
  }

  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get resources for a lesson' })
  async findByLesson(@Param('lessonId') lessonId: string) {
    return this.resourcesService.findByLesson(lessonId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Delete a resource' })
  async remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
