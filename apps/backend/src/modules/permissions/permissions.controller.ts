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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all permissions (admin only)' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved' })
  async findAll() {
    const data = await this.permissionsService.findAll();
    return { success: true, message: 'Permissions retrieved successfully', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission retrieved' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.permissionsService.findById(id);
    return { success: true, message: 'Permission retrieved successfully', data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a permission (admin only)' })
  @ApiResponse({ status: 201, description: 'Permission created' })
  @ApiResponse({ status: 409, description: 'Permission already exists' })
  async create(@Body() dto: CreatePermissionDto) {
    const data = await this.permissionsService.create(dto);
    return { success: true, message: 'Permission created successfully', data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a permission (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission updated' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    const data = await this.permissionsService.update(id, dto);
    return { success: true, message: 'Permission updated successfully', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a permission (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission deleted' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.permissionsService.delete(id);
    return { success: true, message: 'Permission deleted successfully', data: null };
  }
}
