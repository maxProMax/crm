import { Module } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './entities/deal.entity';
import { TenantContextModule } from 'src/common/tenant-context/tenant-context.module';
import { CustomersModule } from '../customers/customers.module';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from '../../common/permissions/permissions.module';
import { PipelinesModule } from '../pipelines/pipelines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deal]),
    TenantContextModule,
    CustomersModule,
    UsersModule,
    PermissionsModule,
    PipelinesModule,
  ],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {}
