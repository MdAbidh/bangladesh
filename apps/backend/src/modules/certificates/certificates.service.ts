import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CertificateStatus } from '@prisma/client';
import { CertificatesRepository } from './certificates.repository';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(private readonly certificatesRepository: CertificatesRepository) {}

  async findByUser(userId: string) {
    return this.certificatesRepository.findByUser(userId);
  }

  async findById(id: string) {
    const certificate = await this.certificatesRepository.findById(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return certificate;
  }

  async verifyCertificate(certificateId: string) {
    const certificate = await this.certificatesRepository.findByCertificateId(certificateId);
    if (!certificate) {
      throw new NotFoundException('Certificate not found or invalid');
    }
    if (certificate.status === CertificateStatus.REVOKED) {
      throw new BadRequestException('This certificate has been revoked');
    }
    return {
      valid: true,
      certificateId: certificate.certificateId,
      title: certificate.title,
      userName: `${certificate.user.firstName} ${certificate.user.lastName}`,
      courseTitle: certificate.course.title,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
    };
  }

  async generate(dto: GenerateCertificateDto) {
    const existing = await this.certificatesRepository.findByUserAndCourse(dto.userId, dto.courseId);
    if (existing && existing.status === CertificateStatus.GENERATED) {
      throw new ConflictException('Certificate already exists for this user and course');
    }

    if (existing && existing.status === CertificateStatus.REVOKED) {
      const certificateId = uuidv4();
      const certificateUrl = `/certificates/${certificateId}`;
      const updated = await this.certificatesRepository.update(existing.id, {
        certificateId,
        certificateUrl,
        status: CertificateStatus.GENERATED,
        revokedAt: null,
        issuedAt: new Date(),
        title: dto.title,
        description: dto.description,
      });
      this.logger.log(`Certificate re-generated: ${updated.id}`);
      return updated;
    }

    const certificateId = uuidv4();
    const certificate: any = {
      title: dto.title,
      description: dto.description,
      certificateId,
      certificateUrl: `/certificates/${certificateId}`,
      status: CertificateStatus.GENERATED,
      user: { connect: { id: dto.userId } },
      course: { connect: { id: dto.courseId } },
    };

    const created = await this.certificatesRepository.create(certificate);
    this.logger.log(`Certificate generated: ${created.id} for user ${dto.userId}`);
    return created;
  }

  async getDownloadUrl(id: string) {
    const certificate = await this.certificatesRepository.findById(id);
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return {
      certificateUrl: certificate.certificateUrl,
      certificateId: certificate.certificateId,
    };
  }
}
