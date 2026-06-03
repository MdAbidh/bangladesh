import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { getOtpEmailHtml } from './templates/otp-email';
import { getWelcomeEmailHtml } from './templates/welcome-email';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.initialize();
  }

  private initialize(): void {
    try {
      const host = this.configService.get<string>('smtp.host', 'smtp.mailtrap.io');
      const port = this.configService.get<number>('smtp.port', 2525);
      const user = this.configService.get<string>('smtp.user');
      const pass = this.configService.get<string>('smtp.pass');
      const secure = this.configService.get<boolean>('smtp.secure', false);
      this.fromAddress = this.configService.get<string>('smtp.from', 'noreply@ahlearning.com');

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
        tls: { rejectUnauthorized: false },
      });

      this.logger.log('Email transporter initialized');
    } catch (error) {
      this.logger.error(`Failed to initialize email transporter: ${(error as Error).message}`);
    }
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"A.H Learning" <${this.fromAddress}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId} to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${(error as Error).message}`);
      throw new Error(`Email send failed: ${(error as Error).message}`);
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const html = getOtpEmailHtml(otp, email.split('@')[0]);
    await this.sendMail({
      to: email,
      subject: 'Your OTP for Email Verification - A.H Learning',
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = getWelcomeEmailHtml(name);
    await this.sendMail({
      to: email,
      subject: 'Welcome to A.H Learning!',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Password Reset</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px;">A.H Learning</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="color:#333;font-size:16px;margin:0 0 8px;">Hello,</p>
              <p style="color:#666;font-size:15px;margin:0 0 24px;line-height:1.6;">
                You recently requested to reset your password. Click the button below to set a new one.
                This link is valid for 1 hour.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${resetLink}"
                   style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;">
                  Reset Password
                </a>
              </div>
              <p style="color:#999;font-size:13px;margin:24px 0 0;">
                If you did not request a password reset, please ignore this email or contact support.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} A.H Learning. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await this.sendMail({
      to: email,
      subject: 'Password Reset - A.H Learning',
      html,
    });
  }

  async sendCertificateEmail(
    email: string,
    name: string,
    courseName: string,
    certificateUrl: string,
  ): Promise<void> {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Congratulations!</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px;">Certificate of Completion</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="color:#333;font-size:16px;margin:0 0 8px;">Dear ${name},</p>
              <p style="color:#666;font-size:15px;margin:0 0 16px;line-height:1.6;">
                Congratulations on completing <strong>${courseName}</strong>!
                Your certificate is now available.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${certificateUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;">
                  View Certificate
                </a>
              </div>
              <p style="color:#666;font-size:14px;margin:24px 0 0;line-height:1.6;">
                Keep learning and achieving your goals with A.H Learning!
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} A.H Learning. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await this.sendMail({
      to: email,
      subject: `Certificate of Completion - ${courseName}`,
      html,
    });
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">${subject}</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px;">A.H Learning</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="color:#666;font-size:15px;margin:0;line-height:1.6;">
                ${message}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} A.H Learning. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await this.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
