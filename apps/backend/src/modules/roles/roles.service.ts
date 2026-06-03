import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly rolesRepository: RolesRepository) {}

  async findAll() {
    return this.rolesRepository.findAll();
  }

  async findById(id: string) {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.rolesRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('A role with this name already exists');
    }

    const role = await this.rolesRepository.create({
      name: dto.name,
      description: dto.description,
    });

    this.logger.log(`Role created: ${role.id} - ${role.name}`);
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;

    return this.rolesRepository.update(id, data);
  }

  async delete(id: string) {
    const role = await this.rolesRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new BadRequestException('Cannot delete system roles');
    }

    await this.rolesRepository.delete(id);
    this.logger.log(`Role deleted: ${id}`);
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.rolesRepository.assignPermissions(roleId, permissionIds);
  }
}
