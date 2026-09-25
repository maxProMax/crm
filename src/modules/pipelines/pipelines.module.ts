import { Module } from '@nestjs/common';
import { PipelinesService } from './services/pipelines.service';
import { PipelinesController } from './controllers/pipelines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pipeline } from './entities/pipeline.entity';
import { PipelineStage } from './entities/pipeline-stage.entity';
import { TenantContextModule } from 'src/common/tenant-context/tenant-context.module';
import { PipelineStagesService } from './services/pipeline-stages.service';
import { PipelineStagesController } from './controllers/pipeline-stages.controller';
import { PermissionsModule } from 'src/common/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pipeline, PipelineStage]),
    TenantContextModule,
    PermissionsModule,
  ],
  controllers: [PipelineStagesController, PipelinesController],
  providers: [PipelinesService, PipelineStagesService],
  exports: [PipelineStagesService],
})
export class PipelinesModule {}
