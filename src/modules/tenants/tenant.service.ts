import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListTenantsQueryDto } from './dto/list-tenants-query.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>,
  ) {}
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenants.findOne({
      where: { slug: createTenantDto.slug },
    });

    if (existingTenant) {
      throw new ConflictException(`Tenant with slug exists`);
    }

    const tenant = this.tenants.create(createTenantDto);
    return this.tenants.save(tenant);
  }

  async findAll(
    query: ListTenantsQueryDto,
  ): Promise<{ items: Tenant[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [items, total] = await this.tenants.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenants.findOneBy({ id });

    if (!tenant) {
      throw new NotFoundException('tenant not found');
    }

    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const tenant = await this.tenants.findOneBy({ slug });

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    let tenant = await this.findOne(id);

    const slug = updateTenantDto.slug;

    if (slug && slug !== tenant.slug) {
      const existingWithSlug = await this.tenants.findOneBy({ slug });

      if (existingWithSlug) {
        throw new ConflictException('slug already exists');
      }
    }

    tenant = await this.tenants.save(Object.assign(tenant, updateTenantDto));

    return tenant;
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);

    await this.tenants.softRemove(tenant);
  }
}
