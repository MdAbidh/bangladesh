import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { EnrollDto } from './dto/enroll.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Enrollments')
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in a course (student)' })
  @ApiResponse({ status: 201, description: 'Enrolled successfully' })
  @ApiResponse({ status: 409, description: 'Already enrolled' })
  async enroll(
    @CurrentUser() user: { sub: string },
    @Body() dto: EnrollDto,
  ) {
    const data = await this.enrollmentsService.enroll(user.sub, dto);
    return { success: true, message: 'Enrolled successfully', data };
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my enrollments (student)' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
  async findMyEnrollments(@CurrentUser() user: { sub: string }) {
    const data = await this.enrollmentsService.findMyEnrollments(user.sub);
    return { success: true, message: 'Enrollments retrieved successfully', data };
  }

  @Get('course/:courseId')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course enrollment list (teacher/admin)' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findCourseEnrollments(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.enrollmentsService.findCourseEnrollments(courseId, user.sub, user.role);
    return { success: true, message: 'Course enrollments retrieved successfully', data };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.enrollmentsService.findById(id);
    return { success: true, message: 'Enrollment retrieved successfully', data };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel enrollment' })
  @ApiParam({ name: 'id', type: String, description: 'Enrollment ID' })
  @ApiResponse({ status: 200, description: 'Enrollment cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async cancelEnrollment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.enrollmentsService.cancelEnrollment(id, user.sub, user.role);
    return { success: true, message: 'Enrollment cancelled successfully', data };
  }
}
