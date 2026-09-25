import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { EntityManager, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { DEFAULT_ROLES } from '../../common/permissions/default-roles';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRolesRepo: Repository<UserRole>,
  ) {}

  async findUserPermissions(userId: string): Promise<Set<string>> {
    const userRoles = await this.userRolesRepo.find({
      where: { userId },
      relations: { role: { permissions: true } },
    });

    // const rows = await this.userRole
    //   .createQueryBuilder('ur')
    //   .innerJoin('ur.role', 'r')
    //   .innerJoin('r.permissions', 'p')
    //   .where('ur.user_id = :userId', { userId })
    //   .select('p.code', 'code')
    //   .getMany();
    // console.log(rows);

    return new Set(
      userRoles.flatMap((u) => u.role.permissions.map((p) => p.code)),
    );
  }

  async seedDefaultRolesForTenant(
    manager: EntityManager,
    tenantId: string,
  ): Promise<Map<string, Role>> {
    const allPermissions = await manager.getRepository(Permission).find();

    const permissionsMap = new Map(allPermissions.map((p) => [p.code, p]));
    const result: Map<string, Role> = new Map();

    for (const [name, conf] of Object.entries(DEFAULT_ROLES)) {
      const permissions = conf.permissions.map((p) => {
        const perm = permissionsMap.get(p);
        if (!perm)
          throw new Error(`Permission ${p} not found. Run migrations.`);
        return perm;
      });

      const role = manager.create(Role, {
        tenantId,
        name,
        description: conf.description,
        permissions,
        isSystem: true,
      });

      await manager.save(role);

      result.set(name, role);
    }

    return result;
  }

  async assignRole(
    manager: EntityManager,
    userId: string,
    roleId: string,
  ): Promise<void> {
    const userRole = manager.create(UserRole, { userId, roleId });

    await manager.save(userRole);
  }
}
