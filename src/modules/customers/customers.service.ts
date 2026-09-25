import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ListCustomerQueryDto } from './dto/list-customers-query.dto';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly tenantContextService: TenantContextService,
    private readonly usersService: UsersService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const tenantId = this.tenantContextService.getTenantId();

    if (createCustomerDto.assignedTo) {
      await this.checkAssignedToUser(createCustomerDto.assignedTo, tenantId);
    }

    const customer = this.customerRepo.create({
      tenantId,
      ...createCustomerDto,
    });

    try {
      await this.customerRepo.save(customer);
    } catch (error) {
      this.checkDuplicateEmailError(error);

      throw error;
    }

    return customer;
  }

  async findAll(listCustomerQueryDto: ListCustomerQueryDto) {
    const tenantId = this.tenantContextService.getTenantId();
    const { page, limit, ...restFilters } = listCustomerQueryDto;
    const [items, total] = await this.customerRepo.findAndCount({
      where: { tenantId, ...restFilters },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const tenantId = this.tenantContextService.getTenantId();

    return this.findByIdAndTenantId({ id, tenantId });
  }

  async findByIdAndTenantId({
    tenantId,
    id,
  }: {
    id: string;
    tenantId: string;
  }) {
    const customer = await this.customerRepo.findOneBy({ tenantId, id });

    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    if (updateCustomerDto.assignedTo) {
      const tenantId = this.tenantContextService.getTenantId();

      await this.checkAssignedToUser(updateCustomerDto.assignedTo, tenantId);
    }

    try {
      return this.customerRepo.save(Object.assign(customer, updateCustomerDto));
    } catch (error) {
      this.checkDuplicateEmailError(error);

      throw error;
    }
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    await this.customerRepo.softRemove(customer);
  }

  private async checkAssignedToUser(userId: string, tenantId: string) {
    const assignedToUser = await this.usersService.findByIdAndTenantId({
      id: userId,
      tenantId,
    });

    if (!assignedToUser) {
      throw new NotFoundException('assignedTo user not found');
    }
  }

  private checkDuplicateEmailError(error: unknown) {
    if (
      error instanceof QueryFailedError &&
      (
        error as QueryFailedError<{
          name: string;
          message: string;
          code: string;
        }>
      ).driverError?.code === '23505'
    ) {
      throw new ConflictException('Email already exists in this tenant');
    }
  }
}
