import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TenantContextModule } from 'src/common/tenant-context/tenant-context.module';
import { UsersModule } from '../users/users.module';
import { CustomersModule } from '../customers/customers.module';
import { DealsModule } from '../deals/deals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { PermissionsModule } from 'src/common/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    TenantContextModule,
    UsersModule,
    CustomersModule,
    DealsModule,
    PermissionsModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
