import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './require-permissions.decorator';
import { Permission } from './permission';
import { AuthenticatedUser } from '../auth/type';
import { RolesService } from '../../modules/roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();

    if (!req.user) {
      throw new UnauthorizedException('PermissionsGuard');
    }

    if (req.user.isSuperAdmin) {
      return true;
    }

    const userPermission = await this.rolesService.findUserPermissions(
      req.user.id,
    );

    if (requiredPermissions.every((p) => userPermission.has(p))) {
      return true;
    }

    throw new ForbiddenException('PermissionsGuard');
  }
}
