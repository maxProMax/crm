import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from 'src/common/tenant-context/guards/tenant-context.guard';
import { PermissionsGuard } from 'src/common/permissions/permissions.guard';
import { ListActivitiesQueryDto } from './dto/list-activity-query.dto';
import { RequirePermissions } from 'src/common/permissions/require-permissions.decorator';
import { Permission } from 'src/common/permissions/permission';

@Controller('activities')
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionsGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @RequirePermissions(Permission.ActivityCreate)
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  @RequirePermissions(Permission.ActivityRead)
  findAll(@Query() listActivitiesQueryDto: ListActivitiesQueryDto) {
    return this.activitiesService.findAll(listActivitiesQueryDto);
  }

  @Get(':id')
  @RequirePermissions(Permission.ActivityRead)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.ActivityUpdate)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.ActivityDelete)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.remove(id);
  }
}
