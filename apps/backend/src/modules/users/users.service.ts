import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.usersRepository.findByFirebaseUid(firebaseUid);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(query: UserQueryDto) {
    return this.usersRepository.findAll(query);
  }

  async create(dto: CreateUserDto & { firebaseUid: string; displayName?: string }): Promise<User> {
    const existingEmail = await this.usersRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('A user with this email already exists');
    }

    const existingUid = await this.usersRepository.findByFirebaseUid(dto.firebaseUid);
    if (existingUid) {
      throw new ConflictException('A user with this Firebase UID already exists');
    }

    return this.usersRepository.create({
      firebaseUid: dto.firebaseUid,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      displayName: dto.displayName || `${dto.firstName} ${dto.lastName}`,
      role: dto.role || UserRole.STUDENT,
    });
  }

  async update(id: string, data: Partial<Pick<User, 'firstName' | 'lastName' | 'displayName' | 'phone' | 'bio' | 'headline'>>): Promise<User> {
    await this.findById(id);
    return this.usersRepository.update(id, data);
  }

  async softDelete(id: string): Promise<User> {
    await this.findById(id);
    return this.usersRepository.softDelete(id);
  }

  async updateRole(id: string, role: UserRole, actorId: string): Promise<User> {
    await this.findById(id);

    if (role === UserRole.ADMIN) {
      this.logger.warn(`Admin role granted to user ${id} by ${actorId}`);
    }

    return this.usersRepository.updateRole(id, role);
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.findById(id);

    if (user.role === UserRole.ADMIN && !isActive) {
      throw new BadRequestException('Cannot deactivate an admin user');
    }

    return this.usersRepository.updateStatus(id, isActive);
  }

  async getProfile(id: string) {
    const profile = await this.usersRepository.findByIdWithRoles(id);
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    return profile;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    await this.findById(id);
    return this.usersRepository.updateProfile(id, dto);
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    await this.findById(id);
    return this.usersRepository.updateAvatar(id, avatarUrl);
  }

  async getUserStats() {
    const [totalUsers, newThisMonth, activeUsers, students, teachers, admins, recentUsers] = await Promise.all([
      this.usersRepository.countTotalUsers(),
      this.usersRepository.countNewUsersThisMonth(),
      this.usersRepository.countActiveUsers(),
      this.usersRepository.countByRole(UserRole.STUDENT),
      this.usersRepository.countByRole(UserRole.TEACHER),
      this.usersRepository.countByRole(UserRole.ADMIN),
      this.usersRepository.findRecentUsers(5),
    ]);

    return {
      totalUsers,
      newUsersThisMonth: newThisMonth,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleDistribution: {
        students,
        teachers,
        admins,
      },
      recentUsers,
    };
  }
}
