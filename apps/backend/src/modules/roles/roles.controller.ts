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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles (admin only)' })
  @ApiResponse({ status: 200, description: 'Roles retrieved' })
  async findAll() {
    const data = await this.rolesService.findAll();
    return { success: true, message: 'Roles retrieved successfully', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID with permissions (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.rolesService.findById(id);
    return { success: true, message: 'Role retrieved successfully', data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a role (admin only)' })
  @ApiResponse({ status: 201, description: 'Role created' })
  @ApiResponse({ status: 409, description: 'Role already exists' })
  async create(@Body() dto: CreateRoleDto) {
    const data = await this.rolesService.create(dto);
    return { success: true, message: 'Role created successfully', data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    const data = await this.rolesService.update(id, dto);
    return { success: true, message: 'Role updated successfully', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete system role' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.rolesService.delete(id);
    return { success: true, message: 'Role deleted successfully', data: null };
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Permissions assigned' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    const data = await this.rolesService.assignPermissions(id, dto.permissionIds);
    return { success: true, message: 'Permissions assigned successfully', data };
  }
}
