import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Deal,
  // DealStage,
  // terminal_stage_completed,
} from './entities/deal.entity';
import { Repository } from 'typeorm';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';
import { ListDealsQueryDto } from './dto/list-deals-query.dto';
import { PipelineStagesService } from '../pipelines/services/pipeline-stages.service';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal) private readonly dealsRepo: Repository<Deal>,
    private readonly tenantContextService: TenantContextService,
    private readonly customerService: CustomersService,
    private readonly userService: UsersService,
    private readonly pipelineStagesService: PipelineStagesService,
  ) {}

  async create(createDealDto: CreateDealDto) {
    const tenantId = this.tenantContextService.getTenantId();

    if (createDealDto.ownerId) {
      await this.userService.findByIdAndTenantId({
        id: createDealDto.ownerId,
        tenantId,
      });
    }

    await this.customerService.findByIdAndTenantId({
      id: createDealDto.customerId,
      tenantId,
    });

    const pipelineStage = await this.pipelineStagesService.findOnePipelineStage(
      createDealDto.pipelineStageId,
    );

    const deal = this.dealsRepo.create({ tenantId, ...createDealDto });

    this.setClosedAt(deal, pipelineStage.isTerminal);

    return this.dealsRepo.save(deal);
  }

  async findAll(listDealsQueryDto: ListDealsQueryDto) {
    const { page, limit, ...restFilters } = listDealsQueryDto;
    const tenantId = this.tenantContextService.getTenantId();

    const [items, total] = await this.dealsRepo.findAndCount({
      where: { tenantId, ...restFilters },
      relations: {
        tenant: true,
        customer: true,
        owner: true,
        pipelineStage: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { items, total, page, limit };
  }

  async findOne(id: string, withRelation = true) {
    const tenantId = this.tenantContextService.getTenantId();

    return this.findByIdAndTenantId({ tenantId, id }, withRelation);
  }

  async findByIdAndTenantId(
    {
      tenantId,
      id,
    }: {
      tenantId: string;
      id: string;
    },
    withRelation = true,
  ) {
    const deal = await this.dealsRepo.findOne({
      where: { tenantId, id },
      relations: {
        tenant: withRelation,
        customer: withRelation,
        pipelineStage: withRelation,
      },
    });

    if (!deal) {
      throw new NotFoundException('deal not found');
    }

    return deal;
  }

  async update(id: string, updateDealDto: UpdateDealDto) {
    const tenantId = this.tenantContextService.getTenantId();
    const deal = await this.findOne(id, false);

    if (updateDealDto.ownerId) {
      await this.userService.findByIdAndTenantId({
        id: updateDealDto.ownerId,
        tenantId,
      });
    }
    if (updateDealDto.customerId) {
      await this.customerService.findByIdAndTenantId({
        id: updateDealDto.customerId,
        tenantId,
      });
    }

    if (updateDealDto.pipelineStageId) {
      const pipelineStage =
        await this.pipelineStagesService.findOnePipelineStage(
          updateDealDto.pipelineStageId,
        );

      this.setClosedAt(deal, pipelineStage.isTerminal);
    }
    console.log(Object.assign(deal, updateDealDto));

    await this.dealsRepo.save(Object.assign(deal, updateDealDto));

    return this.findOne(id);
  }

  async remove(id: string) {
    const deal = await this.findOne(id);

    await this.dealsRepo.softRemove(deal);
  }

  private setClosedAt(deal: Deal, isTerminal: boolean): Deal {
    deal.closedAt = isTerminal ? new Date() : null;

    return deal;
  }
}
