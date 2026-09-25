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
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ListCustomerQueryDto } from './dto/list-customers-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantContextGuard } from 'src/common/tenant-context/guards/tenant-context.guard';
import { PermissionsGuard } from 'src/common/permissions/permissions.guard';
import { RequirePermissions } from 'src/common/permissions/require-permissions.decorator';
import { Permission } from 'src/common/permissions/permission';

@Controller('customers')
@UseGuards(JwtAuthGuard, TenantContextGuard, PermissionsGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @RequirePermissions(Permission.CustomerCreate)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @RequirePermissions(Permission.CustomerRead)
  findAll(@Query() listCustomerQueryDto: ListCustomerQueryDto) {
    return this.customersService.findAll(listCustomerQueryDto);
  }

  @Get(':id')
  @RequirePermissions(Permission.CustomerRead)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.CustomerUpdate)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.CustomerDelete)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
