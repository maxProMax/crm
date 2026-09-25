import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantContextGuard } from './guards/tenant-context.guard';
import { TenantContextMiddleware } from './tenant-context.middleware';

@Module({
  providers: [TenantContextService, TenantContextGuard],
  exports: [TenantContextService, TenantContextGuard],
})
export class TenantContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
