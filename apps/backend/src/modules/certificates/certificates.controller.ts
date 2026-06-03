import {
  Controller,
  Get,
  Post,
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
import { CertificatesService } from './certificates.service';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Certificates')
@UseGuards(JwtAuthGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my certificates (student)' })
  @ApiResponse({ status: 200, description: 'Certificates retrieved successfully' })
  async findMyCertificates(@CurrentUser() user: { sub: string }) {
    const data = await this.certificatesService.findByUser(user.sub);
    return { success: true, message: 'Certificates retrieved successfully', data };
  }

  @Public()
  @Get('verify/:certificateId')
  @ApiOperation({ summary: 'Verify certificate authenticity (public)' })
  @ApiParam({ name: 'certificateId', type: String, description: 'Unique certificate ID' })
  @ApiResponse({ status: 200, description: 'Certificate verified' })
  @ApiResponse({ status: 404, description: 'Certificate not found' })
  async verifyCertificate(@Param('certificateId') certificateId: string) {
    const data = await this.certificatesService.verifyCertificate(certificateId);
    return { success: true, message: 'Certificate verified successfully', data };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Certificate ID' })
  @ApiResponse({ status: 200, description: 'Certificate retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Certificate not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.certificatesService.findById(id);
    return { success: true, message: 'Certificate retrieved successfully', data };
  }

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate certificate for a student (teacher/admin)' })
  @ApiResponse({ status: 201, description: 'Certificate generated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async generate(
    @Body() dto: GenerateCertificateDto,
  ) {
    const data = await this.certificatesService.generate(dto);
    return { success: true, message: 'Certificate generated successfully', data };
  }

  @Post(':id/download')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get certificate download URL' })
  @ApiParam({ name: 'id', type: String, description: 'Certificate ID' })
  @ApiResponse({ status: 200, description: 'Download URL retrieved' })
  @ApiResponse({ status: 404, description: 'Certificate not found' })
  async download(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.certificatesService.getDownloadUrl(id);
    return { success: true, message: 'Download URL retrieved successfully', data };
  }
}
