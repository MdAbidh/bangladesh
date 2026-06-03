import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Audit Logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs with pagination and filters (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'action', required: false, type: String, description: 'Filter by action' })
  @ApiQuery({ name: 'resource', required: false, type: String, description: 'Filter by resource' })
  @ApiQuery({ name: 'actorId', required: false, type: String, description: 'Filter by actor ID' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (ISO)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (ISO)' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved' })
  async findAll(@Query() query: AuditLogQueryDto) {
    const result = await this.auditLogsService.findAll(query);
    return {
      success: true,
      message: 'Audit logs retrieved successfully',
      data: result.items,
      meta: result.meta,
    };
  }
}
