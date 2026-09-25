import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomer1779785870423 implements MigrationInterface {
    name = 'CreateCustomer1779785870423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255), "phone" character varying(255), "company_name" character varying(255), "status" character varying(255) NOT NULL DEFAULT 'lead', "source" character varying(255) NOT NULL, "assigned_to" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "customer_source_check" CHECK (source IN ('website','referral','cold_call','event','other')), CONSTRAINT "customer_status_check" CHECK (status IN ('lead','active','inactive','lost')), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "customers_tenant_email_index_unique" ON "customers" ("tenant_id", "email") WHERE "email" IS NOT NULL AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "customers_assigned_to_index" ON "customers" ("assigned_to") `);
        await queryRunner.query(`CREATE INDEX "customers_tenant_id_index" ON "customers" ("tenant_id") `);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_97913f35ac2e435a4463fb50a01" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_55226d0dc5e08d97f0520ce87a3" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_55226d0dc5e08d97f0520ce87a3"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_97913f35ac2e435a4463fb50a01"`);
        await queryRunner.query(`DROP INDEX "public"."customers_tenant_id_index"`);
        await queryRunner.query(`DROP INDEX "public"."customers_assigned_to_index"`);
        await queryRunner.query(`DROP INDEX "public"."customers_tenant_email_index_unique"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
