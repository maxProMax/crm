import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { ListDealsQueryDto } from './dto/list-deals-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from '../../common/tenant-context/guards/tenant-context.guard';
import { PermissionsGuard } from '../../common/permissions/permissions.guard';
import { RequirePermissions } from '../../common/permissions/require-permissions.decorator';
import { Permission } from '../../common/permissions/permission';

@Controller('deals')
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionsGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @RequirePermissions(Permission.DealCreate)
  create(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.create(createDealDto);
  }

  @Get()
  @RequirePermissions(Permission.DealRead)
  findAll(@Query() listDealsQueryDto: ListDealsQueryDto) {
    return this.dealsService.findAll(listDealsQueryDto);
  }

  @Get(':id')
  @RequirePermissions(Permission.DealRead)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.dealsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.DealUpdate)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDealDto: UpdateDealDto,
  ) {
    return this.dealsService.update(id, updateDealDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.DealDelete)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.dealsService.remove(id);
  }
}
