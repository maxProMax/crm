import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantContextModule } from '../../common/tenant-context/tenant-context.module';
import { PermissionsModule } from '../../common/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    TenantContextModule,
    PermissionsModule,
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
