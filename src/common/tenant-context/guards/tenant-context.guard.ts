import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TenantContextService } from '../tenant-context.service';

@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(private readonly tenantContextService: TenantContextService) {}
  canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { tenantId?: string } }>();
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new UnauthorizedException('TenantContextGuard');
    }

    this.tenantContextService.setTenantId(tenantId);

    return true;
  }
}
