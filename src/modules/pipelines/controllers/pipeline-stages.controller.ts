import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from 'src/common/tenant-context/guards/tenant-context.guard';
import { PermissionsGuard } from 'src/common/permissions/permissions.guard';
import { CreatePipelineStageDto } from '../dto/create-pipeline-stage.dto';
import { ListPipelineStageQueryDto } from '../dto/list-pipeline-stage-query.dto';
import { UpdatePipelineStageDto } from '../dto/update-pipeline-stage.dto';
import { PipelineStagesService } from '../services/pipeline-stages.service';
import { RequirePermissions } from 'src/common/permissions/require-permissions.decorator';
import { Permission } from 'src/common/permissions/permission';

@Controller('pipelines/stages')
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionsGuard)
export class PipelineStagesController {
  constructor(private readonly pipelineStagesService: PipelineStagesService) {}

  @Post()
  @RequirePermissions(Permission.DealCreate)
  createPipelineStage(@Body() createPipelineStageDto: CreatePipelineStageDto) {
    return this.pipelineStagesService.createPipelineStage(
      createPipelineStageDto,
    );
  }

  @Get()
  @RequirePermissions(Permission.DealRead)
  findAllPipelineStages(
    @Query() listPipelineStageQueryDto: ListPipelineStageQueryDto,
  ) {
    return this.pipelineStagesService.findAllPipelineStages(
      listPipelineStageQueryDto,
    );
  }

  @Get(':id')
  @RequirePermissions(Permission.DealRead)
  findOnePipelineStage(@Param('id', ParseUUIDPipe) id: string) {
    return this.pipelineStagesService.findOnePipelineStage(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.DealUpdate)
  updatePipelineStage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePipelineStageDto: UpdatePipelineStageDto,
  ) {
    return this.pipelineStagesService.updatePipelineStage(
      id,
      updatePipelineStageDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.DealDelete)
  removePipelineStage(@Param('id', ParseUUIDPipe) id: string) {
    return this.pipelineStagesService.removePipelineStage(id);
  }
}
