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
import { PipelinesService } from '../services/pipelines.service';
import { CreatePipelineDto } from '../dto/create-pipeline.dto';
import { UpdatePipelineDto } from '../dto/update-pipeline.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from 'src/common/tenant-context/guards/tenant-context.guard';
import { PermissionsGuard } from 'src/common/permissions/permissions.guard';
// import { CreatePipelineStageDto } from './dto/create-pipeline-stage.dto';
import { ListPipelineQueryDto } from '../dto/list-pipeline-query.dto';
import { RequirePermissions } from 'src/common/permissions/require-permissions.decorator';
import { Permission } from 'src/common/permissions/permission';
// import { ListPipelineStageQueryDto } from './dto/list-pipeline-stage-query.dto';
// import { UpdatePipelineStageDto } from './dto/update-pipeline-stage.dto';
// import { PipelineStagesService } from './pipeline-stages.service';

@Controller('pipelines')
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionsGuard)
export class PipelinesController {
  constructor(
    private readonly pipelinesService: PipelinesService,
    // private readonly pipelineStagesService: PipelineStagesService,
  ) {}

  @Post()
  @RequirePermissions(Permission.DealCreate)
  createPipeline(@Body() createPipelineDto: CreatePipelineDto) {
    return this.pipelinesService.createPipeline(createPipelineDto);
  }

  @Get()
  @RequirePermissions(Permission.DealRead)
  findAllPipelines(@Query() listPipelineQueryDto: ListPipelineQueryDto) {
    return this.pipelinesService.findAllPipelines(listPipelineQueryDto);
  }

  @Get(':id')
  @RequirePermissions(Permission.DealRead)
  findOnePipeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.pipelinesService.findOnePipeline(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.DealUpdate)
  updatePipeline(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePipelineDto: UpdatePipelineDto,
  ) {
    return this.pipelinesService.updatePipeline(id, updatePipelineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.DealDelete)
  removePipeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.pipelinesService.removePipeline(id);
  }
}
