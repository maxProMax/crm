import { Injectable, NestMiddleware } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(private readonly tenantContextService: TenantContextService) {}
  use(req: Request, res: Response, next: NextFunction): void {
    this.tenantContextService.run(() => next());
  }
}
