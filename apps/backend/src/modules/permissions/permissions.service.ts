import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findAll() {
    return this.permissionsRepository.findAll();
  }

  async findById(id: string) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const existing = await this.permissionsRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('A permission with this name already exists');
    }

    const permission = await this.permissionsRepository.create({
      name: dto.name,
      description: dto.description,
      resource: dto.resource,
      action: dto.action,
    });

    this.logger.log(`Permission created: ${permission.id} - ${permission.name}`);
    return permission;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.resource !== undefined) data.resource = dto.resource;
    if (dto.action !== undefined) data.action = dto.action;

    return this.permissionsRepository.update(id, data);
  }

  async delete(id: string) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionsRepository.delete(id);
    this.logger.log(`Permission deleted: ${id}`);
  }
}
