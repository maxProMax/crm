import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmOptions } from './config/typeorm.config';
import { TenantModule } from './modules/tenants/tenant.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantContextModule } from './common/tenant-context/tenant-context.module';
import { RoleModule } from './modules/roles/role.module';
import { PermissionsModule } from './common/permissions/permissions.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DealsModule } from './modules/deals/deals.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PipelinesModule } from './modules/pipelines/pipelines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildTypeOrmOptions(config),
    }),
    TenantModule,
    UsersModule,
    AuthModule,
    TenantContextModule,
    RoleModule,
    PermissionsModule,
    CustomersModule,
    DealsModule,
    ActivitiesModule,
    PipelinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
