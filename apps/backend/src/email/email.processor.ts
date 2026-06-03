import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

export interface EmailJobData {
  type: 'otp' | 'welcome' | 'password-reset' | 'certificate' | 'notification' | 'custom';
  to: string;
  payload: Record<string, unknown>;
  customSubject?: string;
  customHtml?: string;
  customText?: string;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    const { type, to, payload, customSubject, customHtml, customText } = job.data;

    this.logger.log(`Processing email job: ${type} to ${to} (attempt ${job.attemptsMade + 1})`);

    try {
      switch (type) {
        case 'otp':
          await this.emailService.sendOtpEmail(to, payload['otp'] as string);
          break;

        case 'welcome':
          await this.emailService.sendWelcomeEmail(to, payload['name'] as string);
          break;

        case 'password-reset':
          await this.emailService.sendPasswordResetEmail(to, payload['resetLink'] as string);
          break;

        case 'certificate':
          await this.emailService.sendCertificateEmail(
            to,
            payload['name'] as string,
            payload['courseName'] as string,
            payload['certificateUrl'] as string,
          );
          break;

        case 'notification':
          await this.emailService.sendNotificationEmail(
            to,
            payload['subject'] as string || customSubject || 'Notification',
            payload['message'] as string,
          );
          break;

        case 'custom':
          if (!customSubject || !customHtml) {
            throw new Error('Custom email requires subject and html');
          }
          await this.emailService.sendMail({
            to,
            subject: customSubject,
            html: customHtml,
            text: customText,
          });
          break;

        default:
          throw new Error(`Unknown email type: ${type}`);
      }

      this.logger.log(`Email job ${job.id} completed: ${type} to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to process email job ${job.id} (${type} to ${to}): ${(error as Error).message}`,
      );

      if (job.attemptsMade < (job.opts?.attempts || 3) - 1) {
        throw error;
      }

      this.logger.warn(`Email job ${job.id} exhausted all retry attempts`);
    }
  }
}
