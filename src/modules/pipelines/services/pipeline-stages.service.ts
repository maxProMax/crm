import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreatePipelineDto } from './dto/create-pipeline.dto';
// import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { Pipeline } from './entities/pipeline.entity';
import { Repository } from 'typeorm';
import { PipelineStage } from '../entities/pipeline-stage.entity';
import { TenantContextService } from 'src/common/tenant-context/tenant-context.service';
import { CreatePipelineStageDto } from '../dto/create-pipeline-stage.dto';
import { UpdatePipelineStageDto } from '../dto/update-pipeline-stage.dto';
// import { ListPipelineQueryDto } from './dto/list-pipeline-query.dto';
import { ListPipelineStageQueryDto } from '../dto/list-pipeline-stage-query.dto';
import { PipelinesService } from './pipelines.service';

@Injectable()
export class PipelineStagesService {
  constructor(
    @InjectRepository(PipelineStage)
    private readonly pipelineStageRepo: Repository<PipelineStage>,
    private readonly pipelinesService: PipelinesService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  async createPipelineStage(createPipelineStageDto: CreatePipelineStageDto) {
    const pipeline = await this.pipelinesService.findOnePipeline(
      createPipelineStageDto.pipelineId,
    );

    const pipelineStage = this.pipelineStageRepo.create({
      ...createPipelineStageDto,
      pipelineId: pipeline.id,
    });

    return this.pipelineStageRepo.save(pipelineStage);
  }

  async findAllPipelineStages(
    listPipelineStageQueryDto: ListPipelineStageQueryDto,
  ) {
    const tenantId = this.tenantContextService.getTenantId();
    const { page, limit, ...filters } = listPipelineStageQueryDto;
    const [items, total] = await this.pipelineStageRepo.findAndCount({
      where: { ...filters, pipeline: { tenantId } },
      relations: { pipeline: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOnePipelineStage(id: string) {
    const tenantId = this.tenantContextService.getTenantId();
    const pipelineStage = await this.pipelineStageRepo.findOne({
      where: { id, pipeline: { tenantId } },
      relations: { pipeline: true },
    });

    if (!pipelineStage) {
      throw new NotFoundException('pipeline-stage not found');
    }

    return pipelineStage;
  }

  async updatePipelineStage(
    id: string,
    updatePipelineStageDto: UpdatePipelineStageDto,
  ) {
    const pipelineStage = await this.findOnePipelineStage(id);

    return this.pipelineStageRepo.save({
      ...pipelineStage,
      ...updatePipelineStageDto,
    });
  }

  async removePipelineStage(id: string) {
    const pipelineStage = await this.findOnePipelineStage(id);

    await this.pipelineStageRepo.softRemove(pipelineStage);
  }
}
