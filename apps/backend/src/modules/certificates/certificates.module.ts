import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { CertificatesRepository } from './certificates.repository';
import { PrismaModule } from '../../database/prisma.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [CertificatesController],
  providers: [CertificatesService, CertificatesRepository],
  exports: [CertificatesService],
})
export class CertificatesModule {}
