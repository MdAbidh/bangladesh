import {
  Controller,
  Get,
  Param,
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
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dashboard stats for teacher or student' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  async getDashboard(@CurrentUser() user: { sub: string; role: string }) {
    const data = await this.analyticsService.getDashboardStats(user.sub, user.role);
    return { success: true, message: 'Dashboard stats retrieved successfully', data };
  }

  @Get('course/:courseId')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get course analytics (teacher/admin)' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course analytics retrieved successfully' })
  async getCourseAnalytics(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: { sub: string; role: string },
  ) {
    const data = await this.analyticsService.getCourseAnalytics(courseId, user.sub, user.role);
    return { success: true, message: 'Course analytics retrieved successfully', data };
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform-wide analytics (admin only)' })
  @ApiResponse({ status: 200, description: 'Admin analytics retrieved successfully' })
  async getAdminAnalytics() {
    const data = await this.analyticsService.getAdminAnalytics();
    return { success: true, message: 'Admin analytics retrieved successfully', data };
  }

  @Get('reports/daily')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate daily report (admin only)' })
  @ApiQuery({ name: 'date', required: false, description: 'Date (ISO format)' })
  @ApiResponse({ status: 200, description: 'Daily report generated' })
  async getDailyReport(@Query('date') date?: string) {
    const data = await this.analyticsService.generateReport('daily', date ? new Date(date) : new Date());
    return { success: true, message: 'Daily report generated successfully', data };
  }

  @Get('reports/weekly')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate weekly report (admin only)' })
  @ApiQuery({ name: 'date', required: false, description: 'Date (ISO format)' })
  @ApiResponse({ status: 200, description: 'Weekly report generated' })
  async getWeeklyReport(@Query('date') date?: string) {
    const data = await this.analyticsService.generateReport('weekly', date ? new Date(date) : new Date());
    return { success: true, message: 'Weekly report generated successfully', data };
  }

  @Get('reports/monthly')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate monthly report (admin only)' })
  @ApiQuery({ name: 'date', required: false, description: 'Date (ISO format)' })
  @ApiResponse({ status: 200, description: 'Monthly report generated' })
  async getMonthlyReport(@Query('date') date?: string) {
    const data = await this.analyticsService.generateReport('monthly', date ? new Date(date) : new Date());
    return { success: true, message: 'Monthly report generated successfully', data };
  }
}
