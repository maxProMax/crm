import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePipelineDto } from '../dto/create-pipeline.dto';
import { UpdatePipelineDto } from '../dto/update-pipeline.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pipeline } from '../entities/pipeline.entity';
import { Repository } from 'typeorm';
// import { PipelineStage } from './entities/pipeline-stage.entity';
import { TenantContextService } from 'src/common/tenant-context/tenant-context.service';
// import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
// import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
import { ListPipelineQueryDto } from '../dto/list-pipeline-query.dto';
// import { ListPipelineStageQueryDto } from './dto/list-pipeline-stage-query.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectRepository(Pipeline)
    private readonly pipelineRepo: Repository<Pipeline>,
    // @InjectRepository(PipelineStage)
    // private readonly pipelineStageRepo: Repository<PipelineStage>,
    private readonly tenantContextService: TenantContextService,
  ) {}
  createPipeline(createPipelineDto: CreatePipelineDto) {
    const tenantId = this.tenantContextService.getTenantId();

    const pipeline = this.pipelineRepo.create({
      tenantId,
      ...createPipelineDto,
    });

    return this.pipelineRepo.save(pipeline);
  }

  async findAllPipelines(listPipelineQueryDto: ListPipelineQueryDto) {
    const tenantId = this.tenantContextService.getTenantId();
    const { page, limit, ...filters } = listPipelineQueryDto;
    const [items, total] = await this.pipelineRepo.findAndCount({
      where: { tenantId, ...filters },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOnePipeline(id: string) {
    const tenantId = this.tenantContextService.getTenantId();
    const pipeline = await this.pipelineRepo.findOneBy({ tenantId, id });

    if (!pipeline) {
      throw new NotFoundException('pipeline not found');
    }

    return pipeline;
  }

  async removePipeline(id: string) {
    const pipeline = await this.findOnePipeline(id);
    await this.pipelineRepo.softRemove(pipeline);
  }

  async updatePipeline(id: string, updatePipelineDto: UpdatePipelineDto) {
    const pipeline = await this.findOnePipeline(id);

    return this.pipelineRepo.save({ ...pipeline, ...updatePipelineDto });
  }

  // async createPipelineStage(createPipelineStageDto: CreatePipelineStageDto) {
  //   const pipeline = await this.findOnePipeline(
  //     createPipelineStageDto.pipelineId,
  //   );

  //   const pipelineStage = this.pipelineStageRepo.create({
  //     ...createPipelineStageDto,
  //     pipelineId: pipeline.id,
  //   });

  //   return this.pipelineStageRepo.save(pipelineStage);
  // }

  // async findAllPipelineStages(
  //   listPipelineStageQueryDto: ListPipelineStageQueryDto,
  // ) {
  //   const { page, limit, ...filters } = listPipelineStageQueryDto;
  //   const [items, total] = await this.pipelineStageRepo.findAndCount({
  //     where: { ...filters },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   return { items, total, page, limit };
  // }

  // async findOnePipelineStage(id: string) {
  //   const tenantId = this.tenantContextService.getTenantId();
  //   const pipelineStage = await this.pipelineStageRepo.findOne({
  //     where: { id },
  //     relations: { pipeline: true },
  //   });

  //   if (!pipelineStage || pipelineStage.pipeline.tenantId !== tenantId) {
  //     throw new NotFoundException('pipeline-stage not found');
  //   }

  //   return pipelineStage;
  // }

  // async updatePipelineStage(
  //   id: string,
  //   updatePipelineStageDto: UpdatePipelineStageDto,
  // ) {
  //   const pipelineStage = await this.findOnePipelineStage(id);

  //   return this.pipelineStageRepo.save({
  //     ...pipelineStage,
  //     ...updatePipelineStageDto,
  //   });
  // }

  // async removePipelineStage(id: string) {
  //   const pipelineStage = await this.findOnePipelineStage(id);

  //   await this.pipelineStageRepo.softRemove(pipelineStage);
  // }
}
