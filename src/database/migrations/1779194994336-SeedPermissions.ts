import { randomUUID } from 'node:crypto';
import { Permission } from '../../common/permissions/permission';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPermissions1779194994336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const code of Object.values(Permission)) {
      await queryRunner.query(
        `INSERT INTO permissions (id, code, description, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (code) DO NOTHING`,
        [randomUUID(), code, ``],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM permissions WHERE code = ANY($1)`, [
      Object.values(Permission),
    ]);
  }
}
