import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(data: {
    tenantId: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    status: UserStatus;
  }): Promise<User> {
    const user = this.userRepo.create(data);

    return this.userRepo.save(user);
  }

  async findByEmail(tenantId: string, email: string): Promise<null | User> {
    const user = await this.userRepo.findOneBy({ tenantId, email });

    return user;
  }

  async findByEmailForAuth(tenantId: string, email: string) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tenant', 'tenant')
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .addSelect('user.passwordHash')
      .where('user.tenantId = :tenantId', { tenantId })
      .andWhere('user.email = :email', { email })
      .getOne();

    return user;
  }

  async findById(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    return user;
  }

  async findByIdAndTenantId({
    id,
    tenantId,
  }: {
    id: string;
    tenantId: string;
  }) {
    const user = await this.userRepo.findOneBy({ id, tenantId });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
