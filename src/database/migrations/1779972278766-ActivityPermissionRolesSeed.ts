import { randomUUID } from 'crypto';
import { Permission } from '../../common/permissions/permission';

import { MigrationInterface, QueryRunner } from 'typeorm';
import { DEFAULT_ROLES } from '../../common/permissions/default-roles';

const newPermission = [
  Permission.ActivityCreate,
  Permission.ActivityRead,
  Permission.ActivityUpdate,
  Permission.ActivityDelete,
];
export class ActivityRolesSeed1779972278766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const code of newPermission) {
      await queryRunner.query(
        `INSERT INTO permissions (id, code, description, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (code) DO NOTHING`,
        [randomUUID(), code, ``],
      );
    }

    const roles = (await queryRunner.query(
      `SELECT id, name FROM roles WHERE name = ANY($1)`,
      [Object.keys(DEFAULT_ROLES)],
    )) as { id: string; name: string }[];

    const permissions = (await queryRunner.query(
      `SELECT id, code FROM permissions WHERE code = ANY($1)`,
      [newPermission],
    )) as { id: string; code: string }[];

    const config = [
      { roles: roles.filter((r) => r.name === 'admin'), permissions },
      {
        roles: roles.filter((r) => r.name === 'manager'),
        permissions,
      },
      {
        roles: roles.filter((r) => r.name === 'sales'),
        permissions: permissions.filter(
          (p) => p.code !== (Permission.ActivityDelete as string),
        ),
      },
    ];

    for (const { roles, permissions } of config) {
      for (const role of roles) {
        for (const permission of permissions) {
          if (!role) continue;

          const rolesPermissionsValues = [role.id, permission.id];

          await queryRunner.query(
            `INSERT INTO role_permissions (role_id, permission_id) VALUES (${rolesPermissionsValues.map((_, i) => `$` + (i + 1)).join(',')}) ON CONFLICT DO NOTHING`,
            rolesPermissionsValues,
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
