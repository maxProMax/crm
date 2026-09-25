import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTenants1778513897100 implements MigrationInterface {
    name = 'CreateTenants1778513897100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "slug" character varying(100) NOT NULL, "plan" character varying(50) NOT NULL DEFAULT 'free', "status" character varying(50) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "tenants_status_check" CHECK (status IN ('active','suspended','deleted')), CONSTRAINT "tenants_plan_check" CHECK (plan IN ('free','pro','enterprise')), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "tenants_slug_uniq" ON "tenants" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."tenants_slug_uniq"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }

}
