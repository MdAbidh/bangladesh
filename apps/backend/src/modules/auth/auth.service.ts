import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as admin from 'firebase-admin';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from '../../common/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly firebaseApiKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.firebaseApiKey = this.configService.get<string>('FIREBASE_WEB_API_KEY', '');
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (!admin.apps.length) {
      const projectId = this.configService.get<string>('firebase.projectId');
      const privateKey = this.configService.get<string>('firebase.privateKey');
      const clientEmail = this.configService.get<string>('firebase.clientEmail');

      if (projectId && privateKey && clientEmail) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: privateKey.replace(/\\n/g, '\n'),
            clientEmail,
          }),
        });
        this.logger.log('Firebase Admin SDK initialized successfully');
      } else {
        this.logger.warn('Firebase configuration incomplete. Firebase features will be unavailable.');
      }
    }
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    try {
      const firebaseUser = await admin.auth().createUser({
        email: dto.email,
        password: dto.password,
        displayName: `${dto.firstName} ${dto.lastName}`,
      });

      const user = await this.usersService.create({
        firebaseUid: firebaseUser.uid,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`,
        role: 'STUDENT',
      });

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      const otp = await this.generateAndCacheOtp(dto.email);
      await this.emailService.sendOtpEmail(dto.email, otp);

      this.logger.log(`User registered successfully: ${dto.email}`);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('This email is already registered with Firebase');
      }
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Registration failed for ${dto.email}: ${error.message}`, error.stack);
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const cacheKey = `otp:${dto.email}`;
    const cachedOtp = await this.cacheManager.get<string>(cacheKey);

    if (!cachedOtp) {
      throw new BadRequestException('OTP has expired or is invalid. Please request a new one.');
    }

    if (cachedOtp !== dto.otp) {
      throw new BadRequestException('Invalid OTP code. Please try again.');
    }

    await this.cacheManager.del(cacheKey);

    const user = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isEmailVerified: true },
    });

    this.logger.log(`Email verified successfully: ${dto.email}`);

    return { user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto) {
    let firebaseUid: string;

    if (this.firebaseApiKey) {
      firebaseUid = await this.verifyFirebasePassword(dto.email, dto.password);
    } else {
      try {
        const firebaseUser = await admin.auth().getUserByEmail(dto.email);
        firebaseUid = firebaseUser.uid;
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          throw new UnauthorizedException('Invalid email or password');
        }
        throw new UnauthorizedException('Authentication service unavailable');
      }
    }

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      const firebaseUser = await admin.auth().getUser(firebaseUid);
      user = await this.usersService.create({
        firebaseUid: firebaseUser.uid,
        email: dto.email,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'Unknown',
        displayName: firebaseUser.displayName || dto.email,
        role: 'STUDENT',
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    this.logger.log(`User logged in successfully: ${dto.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
        issuer: this.configService.get<string>('jwt.issuer'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (storedToken.isRevoked) {
      await this.revokeAllUserTokens(storedToken.userId);
      throw new UnauthorizedException('Refresh token has been revoked. Please log in again.');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token has expired. Please log in again.');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true, revokedAt: new Date() },
    });

    const user = storedToken.user;
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    this.logger.log(`Tokens refreshed for user: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: { token: refreshToken, userId, isRevoked: false },
    });

    if (storedToken) {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true, revokedAt: new Date() },
      });
      this.logger.log(`User logged out: ${userId}`);
    }

    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    await this.revokeAllUserTokens(userId);
    this.logger.log(`User logged out from all devices: ${userId}`);
    return { message: 'Logged out from all devices successfully' };
  }

  async forgotPassword(email: string) {
    try {
      await admin.auth().getUserByEmail(email);
    } catch {
      throw new BadRequestException('No account found with this email address');
    }

    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: `${this.configService.get<string>('frontendUrl')}/auth/reset-password`,
      handleCodeInApp: false,
    });

    await this.emailService.sendPasswordResetEmail(email, resetLink);

    this.logger.log(`Password reset email sent: ${email}`);

    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      // Firebase Admin SDK doesn't support verifyPasswordResetCode
      // Password reset should be handled by Firebase client SDK on frontend
      // For backend, we use a simpler approach with database-stored reset tokens
      
      // This is a placeholder - in production, use a reset token from database
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Update user password (would need password field in User model)
      // For now, we'll throw an error asking users to use Firebase Console
      throw new BadRequestException(
        'Password reset through API is disabled. Please use the password reset email link.'
      );
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Password reset failed: ${error.message}`, error.stack);
      throw new BadRequestException('Password reset failed. Please try again.');
    }
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user: this.sanitizeUser(user) };
  }

  async sendOtp(dto: SendOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('No account found with this email address');
    }

    const otp = await this.generateAndCacheOtp(dto.email);
    await this.emailService.sendOtpEmail(dto.email, otp);

    this.logger.log(`OTP sent to email: ${dto.email}`);

    return { message: 'OTP sent successfully' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({ sub: userId, email, role }),
      this.generateRefreshToken(userId),
    ]);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(payload: { sub: string; email: string; role: string }): Promise<string> {
    const userPermissions = await this.getUserPermissions(payload.sub);

    return this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        permissions: userPermissions,
      },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
        issuer: this.configService.get<string>('jwt.issuer'),
      },
    );
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
        issuer: this.configService.get<string>('jwt.issuer'),
      },
    );

    const expiresInMs = this.parseExpiryToMs(this.configService.get<string>('jwt.refreshExpiresIn', '7d'));

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + expiresInMs),
      },
    });

    return refreshToken;
  }

  private async getUserPermissions(userId: string): Promise<string[]> {
    const roleAssignments = await this.prisma.userRoleAssignment.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    const permissions = new Set<string>();
    for (const assignment of roleAssignments) {
      for (const rp of assignment.role.permissions) {
        permissions.add(`${rp.permission.resource}:${rp.permission.action}`);
      }
    }

    return Array.from(permissions);
  }

  private async generateAndCacheOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const cacheKey = `otp:${email}`;
    const otpTtl = 5 * 60 * 1000;

    await this.cacheManager.set(cacheKey, otp, otpTtl);

    return otp;
  }

  private async verifyFirebasePassword(email: string, password: string): Promise<string> {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessages: Record<string, string> = {
          'EMAIL_NOT_FOUND': 'Invalid email or password',
          'INVALID_PASSWORD': 'Invalid email or password',
          'INVALID_LOGIN_CREDENTIALS': 'Invalid email or password',
          'USER_DISABLED': 'This account has been disabled',
          'TOO_MANY_ATTEMPTS_TRY_LATER': 'Too many login attempts. Please try again later.',
        };
        throw new UnauthorizedException(
          errorMessages[data.error?.message] || 'Authentication failed',
        );
      }

      const firebaseUser = await admin.auth().getUserByEmail(email);
      return firebaseUser.uid;
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error(`Firebase password verification failed: ${error.message}`);
      throw new UnauthorizedException('Authentication service unavailable');
    }
  }

  private async revokeAllUserTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    });
  }

  private parseExpiryToMs(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private sanitizeUser(user: any) {
    const { password, firebaseUid, deletedAt, ...safeUser } = user;
    return safeUser;
  }
}
