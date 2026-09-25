import { Module } from '@nestjs/common';
import { PermissionsGuard } from './permissions.guard';
import { RoleModule } from 'src/modules/roles/role.module';

@Module({
  imports: [RoleModule],
  providers: [PermissionsGuard],
  exports: [PermissionsGuard, RoleModule],
})
export class PermissionsModule {}
