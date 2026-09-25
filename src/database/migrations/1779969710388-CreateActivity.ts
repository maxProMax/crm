import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivity1779969710388 implements MigrationInterface {
  name = 'CreateActivity1779969710388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "type" character varying(50) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending', "tenant_id" uuid NOT NULL, "deal_id" uuid, "customer_id" uuid NOT NULL, "created_by_id" uuid, "assigned_to_id" uuid, "scheduled_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "activities_status_check" CHECK (status in ('pending','done','canceled')), CONSTRAINT "activities_type_check" CHECK (type in ('call','meeting','task')), CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_activities_tenant_id_status" ON "activities" ("tenant_id", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_activities_tenant_id_assigned_to" ON "activities" ("tenant_id", "assigned_to_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_activities_tenant_id_deal_id" ON "activities" ("tenant_id", "deal_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_activities_tenant_id_customer_id" ON "activities" ("tenant_id", "customer_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_d93b88829c6e18be67ebf2e7f15" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_04fa1883f5dc10f9a9661074ae0" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_55dbe3699eb1b38f4c608e1bce1" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_4dd73efe65b7a57c7f8038715a4" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_97107d6a5eaad47da3d124fa585" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_97107d6a5eaad47da3d124fa585"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_4dd73efe65b7a57c7f8038715a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_55dbe3699eb1b38f4c608e1bce1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_04fa1883f5dc10f9a9661074ae0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_d93b88829c6e18be67ebf2e7f15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_activities_tenant_id_customer_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_activities_tenant_id_deal_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_activities_tenant_id_assigned_to"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_activities_tenant_id_status"`,
    );
    await queryRunner.query(`DROP TABLE "activities"`);
  }
}
