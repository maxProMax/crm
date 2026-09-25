import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { TenantContextService } from 'src/common/tenant-context/tenant-context.service';
import { CustomersService } from '../customers/customers.service';
import { DealsService } from '../deals/deals.service';
import { UsersService } from '../users/users.service';
import { ListActivitiesQueryDto } from './dto/list-activity-query.dto';
import { Deal } from '../deals/entities/deal.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    private readonly tenantContextService: TenantContextService,
    private readonly customerService: CustomersService,
    private readonly dealService: DealsService,
    private readonly userService: UsersService,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    const tenantId = this.tenantContextService.getTenantId();

    if (!createActivityDto.customerId && !createActivityDto.dealId) {
      throw new BadRequestException('customerId or dealId required');
    }

    await this.checkCustomerDealUser(tenantId, createActivityDto);

    const activity = this.activityRepo.create({
      tenantId,
      ...createActivityDto,
    });

    activity.customerId = await this.getCustomerId(
      createActivityDto.customerId,
      createActivityDto.dealId,
    );

    return this.activityRepo.save(activity);
  }

  async findAll(listActivitiesQueryDto: ListActivitiesQueryDto) {
    const tenantId = this.tenantContextService.getTenantId();
    const { page, limit, ...restFilters } = listActivitiesQueryDto;

    const [items, total] = await this.activityRepo.findAndCount({
      where: { tenantId, ...restFilters },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const tenantId = this.tenantContextService.getTenantId();

    const activity = await this.activityRepo.findOneBy({
      tenantId,
      id,
    });

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    return activity;
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    const tenantId = this.tenantContextService.getTenantId();
    const activity = await this.findOne(id);

    await this.checkCustomerDealUser(tenantId, updateActivityDto);

    const updatedActivity = Object.assign(activity, updateActivityDto);

    if (updateActivityDto.customerId || updateActivityDto.dealId) {
      updatedActivity.customerId = await this.getCustomerId(
        updateActivityDto.customerId,
        updateActivityDto.dealId,
      );
    }

    return this.activityRepo.save(updatedActivity);
  }

  async remove(id: string) {
    const activity = await this.findOne(id);

    return this.activityRepo.softRemove(activity);
  }

  private async checkCustomerDealUser(
    tenantId: string,
    {
      customerId,
      dealId,
      assignedToId,
    }: Pick<CreateActivityDto, 'customerId' | 'dealId' | 'assignedToId'>,
  ) {
    if (customerId) {
      await this.customerService.findByIdAndTenantId({
        tenantId,
        id: customerId,
      });
    }

    if (dealId) {
      await this.dealService.findByIdAndTenantId({ tenantId, id: dealId });
    }

    if (assignedToId) {
      await this.userService.findByIdAndTenantId({
        tenantId,
        id: assignedToId,
      });
    }
  }

  private async getCustomerId(
    customerId?: string,
    dealId?: string,
  ): Promise<string> {
    let deal: Deal | null = null;

    if (!customerId && !dealId) {
      throw new BadRequestException('customerId or dealId required');
    }

    if (dealId) {
      deal = await this.dealService.findOne(dealId);
    }

    if (customerId && deal && deal.customerId !== customerId) {
      throw new BadRequestException(
        'customerId does not match the deal customer',
      );
    }

    return (customerId || deal?.customerId) as string;
  }
}
