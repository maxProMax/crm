import { randomUUID } from 'node:crypto';

import {
  TenantPlan,
  TenantStatus,
} from '../../modules/tenants/entities/tenant.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Permission } from '../../common/permissions/permission';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../../modules/users/entities/user.entity';

export class SeedSystemTenant1779198090236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.SYSTEM_ADMIN_EMAIL;
    const password = process.env.SYSTEM_ADMIN_PASSWORD;

    if (!email || !password)
      throw new Error('SYSTEM_ADMIN_EMAIL/PASSWORD must be set');

    const existing = (await queryRunner.query(
      `SELECT id FROM tenants WHERE is_system = TRUE LIMIT 1`,
    )) as any[];

    if (existing.length > 0) return;

    const tenantID = randomUUID();
    await queryRunner.query(
      `INSERT INTO tenants (id, name, slug, plan, status, is_system) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        tenantID,
        'system',
        '_system',
        TenantPlan.Enterprise,
        TenantStatus.Active,
        true,
      ],
    );

    const roleId = randomUUID();
    const rolesValues = [roleId, tenantID, 'super_admin', true];
    await queryRunner.query(
      `INSERT INTO roles (id, tenant_id, name, is_system) VALUES (${rolesValues.map((_, i) => `$` + (i + 1)).join(',')})`,
      rolesValues,
    );

    const perms = (await queryRunner.query(
      `SELECT id FROM permissions WHERE code = ANY($1)`,
      [
        [
          Permission.TenantCreate,
          Permission.TenantRead,
          Permission.TenantUpdate,
          Permission.TenantDelete,
        ],
      ],
    )) as { id: string }[];

    for (const { id: permission_id } of perms) {
      const rolesPermissionsValues = [roleId, permission_id];
      await queryRunner.query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES (${rolesPermissionsValues.map((_, i) => `$` + (i + 1)).join(',')})`,
        rolesPermissionsValues,
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = randomUUID();
    const userValues = [
      userId,
      tenantID,
      email,
      passwordHash,
      'System',
      'Admin',
      UserStatus.Active,
    ];
    await queryRunner.query(
      `INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, status) VALUES (${userValues.map((_, i) => `$` + (i + 1)).join(',')})`,
      userValues,
    );

    const userRoleValues = [userId, roleId];
    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES (${userRoleValues.map((_, i) => `$` + (i + 1)).join(',')})`,
      userRoleValues,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tenants = (await queryRunner.query(
      `SELECT id FROM tenants WHERE is_system = TRUE LIMIT 1`,
    )) as { id: string }[] | undefined;

    if (!tenants?.length) {
      return;
    }
    const [tenant] = tenants;

    await queryRunner.query(`DELETE FROM users WHERE tenant_id = $1`, [
      tenant.id,
    ]);
    await queryRunner.query(`DELETE FROM roles WHERE tenant_id = $1`, [
      tenant.id,
    ]);
    await queryRunner.query(`DELETE FROM tenants WHERE is_system = TRUE `);
  }
}
