import {
  Controller,
  Get,
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
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile with roles and permissions' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: { sub: string }) {
    const profile = await this.usersService.getProfile(user.sub);
    return { success: true, message: 'Profile retrieved successfully', data: profile };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.updateProfile(user.sub, dto);
    return { success: true, message: 'Profile updated successfully', data: updated };
  }

  @Put('profile/avatar')
  @ApiOperation({ summary: 'Update current user avatar URL' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid avatar URL' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAvatar(
    @CurrentUser() user: { sub: string },
    @Body('avatarUrl') avatarUrl: string,
  ) {
    const updated = await this.usersService.updateAvatar(user.sub, avatarUrl);
    return { success: true, message: 'Avatar updated successfully', data: updated };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @ApiOperation({ summary: 'Get user by ID (admin/teacher only)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    return { success: true, message: 'User retrieved successfully', data: user };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users with pagination and filters (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllUsers(@Query() query: UserQueryDto) {
    const result = await this.usersService.findAll(query);
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: result.items,
      meta: result.meta,
    };
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update user role (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: { sub: string },
  ) {
    const updated = await this.usersService.updateRole(id, dto.role, user.sub);
    return { success: true, message: 'Role updated successfully', data: updated };
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Activate or deactivate user (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiQuery({ name: 'isActive', type: Boolean, required: true, description: 'New active status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status change' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('isActive') isActive: string,
  ) {
    const active = isActive === 'true';
    const updated = await this.usersService.updateStatus(id, active);
    return { success: true, message: `User ${active ? 'activated' : 'deactivated'} successfully`, data: updated };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Soft delete a user (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.softDelete(id);
    return { success: true, message: 'User deleted successfully', data: null };
  }
}
