import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { TenantContextModule } from '../../common/tenant-context/tenant-context.module';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from 'src/common/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    TenantContextModule,
    UsersModule,
    PermissionsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
