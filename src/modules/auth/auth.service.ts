import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { TenantService } from '../tenants/tenant.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../tenants/entities/tenant.entity';
import { User, UserStatus } from '../users/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly rolesService: RolesService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const { userId, tenantId, email } = await this.dataSource.transaction(
      async (manager) => {
        const existing = await manager.findOne(Tenant, {
          where: { slug: dto.tenant.slug },
        });

        if (existing) throw new ConflictException('slug already taken');

        const tenant = manager.create(Tenant, {
          name: dto.tenant.name,
          slug: dto.tenant.slug,
        });

        await manager.save(tenant);
        const rolesMap = await this.rolesService.seedDefaultRolesForTenant(
          manager,
          tenant.id,
        );

        const passwordHash = await bcrypt.hash(dto.user.password, 10);

        const user = manager.create(User, {
          tenantId: tenant.id,
          email: dto.user.email,
          passwordHash,
          firstName: dto.user.firstName,
          lastName: dto.user.lastName,
          status: UserStatus.Active,
        });

        await manager.save(user);

        const adminRole = rolesMap.get('admin');

        if (!adminRole) {
          throw new Error('admin role not seeded');
        }

        await this.rolesService.assignRole(manager, user.id, adminRole.id);

        return { userId: user.id, tenantId: tenant.id, email: user.email };
      },
    );

    return this.signToken({
      sub: userId,
      tenantId,
      email,
      isSuperAdmin: false,
    });
  }

  private signToken(payload: JwtPayload): { accessToken: string } {
    return { accessToken: this.jwtService.sign(payload) };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const tenant = await this.tenantService.findBySlug(dto.tenantSlug);

    if (!tenant) throw new UnauthorizedException('Invalid credentials');

    const user = await this.usersService.findByEmailForAuth(
      tenant.id,
      dto.email,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException(`Account is ${user.status}`);
    }

    const isSuperAdmin =
      user.tenant.isSystem &&
      user.userRoles.some((ur) => ur.role.name === 'super_admin');

    return this.signToken({
      sub: user.id,
      tenantId: tenant.id,
      email: user.email,
      isSuperAdmin,
    });
  }
}
