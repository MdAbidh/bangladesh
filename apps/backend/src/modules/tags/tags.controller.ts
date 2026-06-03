import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all tags (public)' })
  @ApiResponse({ status: 200, description: 'Tags retrieved' })
  async findAll() {
    const data = await this.tagsService.findAll();
    return { success: true, message: 'Tags retrieved successfully', data };
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular tags (public)' })
  @ApiResponse({ status: 200, description: 'Popular tags retrieved' })
  async findPopular() {
    const data = await this.tagsService.findPopular();
    return { success: true, message: 'Popular tags retrieved successfully', data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tag (admin only)' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  @ApiResponse({ status: 409, description: 'Tag already exists' })
  async create(@Body() dto: CreateTagDto) {
    const data = await this.tagsService.create(dto);
    return { success: true, message: 'Tag created successfully', data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a tag (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Tag ID' })
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  async delete(@Param('id') id: string) {
    await this.tagsService.delete(id);
    return { success: true, message: 'Tag deleted successfully', data: null };
  }
}
