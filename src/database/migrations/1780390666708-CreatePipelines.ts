import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePipelines1780390666708 implements MigrationInterface {
    name = 'CreatePipelines1780390666708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."deal_tenant_id_stage_index"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "deal_stage_closed_at_check"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "deal_stage_check"`);
        await queryRunner.query(`ALTER TABLE "deals" RENAME COLUMN "stage" TO "pipeline_stage_id"`);
        await queryRunner.query(`CREATE TABLE "pipelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e38ea171cdfad107c1f3db2c036" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pipeline_stages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pipeline_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "position" integer NOT NULL, "is_terminal" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_92e43270eace072ad5182fc08e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "pipeline_stage_id"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "pipeline_stage_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pipelines" ADD CONSTRAINT "FK_842def49e3f739e3c9dd786819c" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pipeline_stages" ADD CONSTRAINT "FK_37b689c446ebe79ecd37e445735" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_11648e54660ce30a05038ba3cdd" FOREIGN KEY ("pipeline_stage_id") REFERENCES "pipeline_stages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_11648e54660ce30a05038ba3cdd"`);
        await queryRunner.query(`ALTER TABLE "pipeline_stages" DROP CONSTRAINT "FK_37b689c446ebe79ecd37e445735"`);
        await queryRunner.query(`ALTER TABLE "pipelines" DROP CONSTRAINT "FK_842def49e3f739e3c9dd786819c"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "pipeline_stage_id"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "pipeline_stage_id" character varying(100) NOT NULL DEFAULT 'new'`);
        await queryRunner.query(`DROP TABLE "pipeline_stages"`);
        await queryRunner.query(`DROP TABLE "pipelines"`);
        await queryRunner.query(`ALTER TABLE "deals" RENAME COLUMN "pipeline_stage_id" TO "stage"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "deal_stage_check" CHECK (((stage)::text = ANY ((ARRAY['new'::character varying, 'qualified'::character varying, 'proposal'::character varying, 'negotiation'::character varying, 'won'::character varying, 'lost'::character varying, 'canceled'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "deal_stage_closed_at_check" CHECK (((((stage)::text = ANY ((ARRAY['won'::character varying, 'lost'::character varying, 'canceled'::character varying])::text[])) AND (closed_at IS NOT NULL)) OR (((stage)::text = ANY ((ARRAY['new'::character varying, 'qualified'::character varying, 'proposal'::character varying, 'negotiation'::character varying])::text[])) AND (closed_at IS NULL))))`);
        await queryRunner.query(`CREATE INDEX "deal_tenant_id_stage_index" ON "deals" ("stage", "tenant_id") `);
    }

}
