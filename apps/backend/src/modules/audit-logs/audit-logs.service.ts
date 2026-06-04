import { Injectable, Logger } from '@nestjs/common';
import { AuditLogsRepository } from './audit-logs.repository';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private readonly auditLogsRepository: AuditLogsRepository) {}

  async log(params: {
    action: string;
    resource: string;
    resourceId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    actorId?: string;
  }) {
    const log = await this.auditLogsRepository.create({
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      description: params.description,
      metadata: params.metadata as any,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      actor: params.actorId ? { connect: { id: params.actorId } } : undefined,
    });
    this.logger.log(`Audit log: ${params.action} on ${params.resource} by ${params.actorId || 'system'}`);
    return log;
  }

  async findAll(query: AuditLogQueryDto) {
    return this.auditLogsRepository.findAll(query);
  }
}
