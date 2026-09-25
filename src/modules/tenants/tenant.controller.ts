import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ListTenantsQueryDto } from './dto/list-tenants-query.dto';
import { TenantContextGuard } from '../../common/tenant-context/guards/tenant-context.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextService } from '../../common/tenant-context/tenant-context.service';
import { PermissionsGuard } from '../../common/permissions/permissions.guard';
import { Permission } from '../../common/permissions/permission';
import { RequirePermissions } from '../../common/permissions/require-permissions.decorator';

@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionsGuard)
@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  @RequirePermissions(Permission.TenantCreate)
  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @RequirePermissions(Permission.TenantRead)
  @Get()
  findAll(@Query() query: ListTenantsQueryDto) {
    return this.tenantService.findAll(query);
  }

  @Get('current')
  async findCurrent() {
    const tenantId = this.tenantContextService.getTenantId();
    const tenant = await this.tenantService.findOne(tenantId);

    return tenant;
  }

  @RequirePermissions(Permission.TenantRead)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantService.findOne(id);
  }

  @RequirePermissions(Permission.TenantUpdate)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantService.update(id, updateTenantDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.TenantDelete)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tenantService.remove(id);
  }
}
