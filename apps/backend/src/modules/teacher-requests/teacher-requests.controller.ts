import {
  Controller,
  Get,
  Post,
  Patch,
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
import { TeacherRequestsService } from './teacher-requests.service';
import { CreateTeacherRequestDto } from './dto/create-teacher-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Teacher Requests')
@UseGuards(JwtAuthGuard)
@Controller('teacher-requests')
export class TeacherRequestsController {
  constructor(private readonly teacherRequestsService: TeacherRequestsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a request to become a teacher (student)' })
  @ApiResponse({ status: 201, description: 'Request submitted' })
  @ApiResponse({ status: 409, description: 'Request already exists' })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateTeacherRequestDto,
  ) {
    const data = await this.teacherRequestsService.create(user.sub, dto);
    return { success: true, message: 'Teacher request submitted successfully', data };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all teacher requests (admin only)' })
  @ApiResponse({ status: 200, description: 'Requests retrieved' })
  async findAll() {
    const data = await this.teacherRequestsService.findAll();
    return { success: true, message: 'Teacher requests retrieved successfully', data };
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a teacher request (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Request ID' })
  @ApiResponse({ status: 200, description: 'Request approved' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
  ) {
    const data = await this.teacherRequestsService.approve(id, user.sub);
    return { success: true, message: 'Teacher request approved', data };
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a teacher request (admin only)' })
  @ApiParam({ name: 'id', type: String, description: 'Request ID' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
    @Body('reason') reason?: string,
  ) {
    const data = await this.teacherRequestsService.reject(id, user.sub, reason);
    return { success: true, message: 'Teacher request rejected', data };
  }
}
