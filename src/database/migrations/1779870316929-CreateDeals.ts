import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeals1779870316929 implements MigrationInterface {
  name = 'CreateDeals1779870316929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "customer_id" uuid NOT NULL, "owner_id" uuid, "title" character varying(255) NOT NULL, "description" text, "amount" numeric(15,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'EUR', "stage" character varying(100) NOT NULL DEFAULT 'new', "expected_close_date" date, "closed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "deal_stage_closed_at_check" CHECK ((stage IN ('won','lost','canceled') AND closed_at IS NOT NULL)
  OR
  (stage IN ('new','qualified','proposal','negotiation') AND closed_at IS NULL)), CONSTRAINT "deal_amount_check" CHECK (amount >= 0), CONSTRAINT "deal_stage_check" CHECK (stage IN ('new','qualified','proposal','negotiation','won','lost','canceled')), CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
    await queryRunner.query(
      `CREATE INDEX "deal_owner_id_index" ON "deals" ("owner_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "deal_customer_id_index" ON "deals" ("customer_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "deal_tenant_id_stage_index" ON "deals" ("tenant_id", "stage") `,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_d40aeaababdbc39be4820cd1f55" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_9be56ac4039640667147157451a" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_39cb9fb7b130a5e5f7c5e290665" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_39cb9fb7b130a5e5f7c5e290665"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_9be56ac4039640667147157451a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_d40aeaababdbc39be4820cd1f55"`,
    );
    await queryRunner.query(`DROP INDEX "public"."deal_tenant_id_stage_index"`);
    await queryRunner.query(`DROP INDEX "public"."deal_customer_id_index"`);
    await queryRunner.query(`DROP INDEX "public"."deal_owner_id_index"`);
    await queryRunner.query(`DROP TABLE "deals"`);
  }
}
