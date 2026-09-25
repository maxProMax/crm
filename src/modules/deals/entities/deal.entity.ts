import { User } from '../../../modules/users/entities/user.entity';
import { Customer } from '../../../modules/customers/entities/customer.entity';
import { Tenant } from '../../../modules/tenants/entities/tenant.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { get_CHECK_IN_Values } from '../../../common/db/utils';
import { PipelineStage } from '../../../modules/pipelines/entities/pipeline-stage.entity';

// export enum DealStage {
//   new = 'new',
//   qualified = 'qualified',
//   proposal = 'proposal',
//   negotiation = 'negotiation',
//   won = 'won',
//   lost = 'lost',
//   canceled = 'canceled',
// }

// export const terminal_stage_completed = [
//   DealStage.won,
//   DealStage.lost,
//   DealStage.canceled,
// ];

// export const terminal_stage_rest = Object.values(DealStage).filter(
//   (v) => !terminal_stage_completed.includes(v),
// );

@Entity({ name: 'deals' })
// @Check('deal_stage_check', `stage IN (${get_CHECK_IN_Values(DealStage)})`)
@Check('deal_amount_check', 'amount >= 0')
// @Check(
//   'deal_stage_closed_at_check',
//   `(stage IN (${get_CHECK_IN_Values(terminal_stage_completed)}) AND closed_at IS NOT NULL)
//   OR
//   (stage IN (${get_CHECK_IN_Values(terminal_stage_rest)}) AND closed_at IS NULL)`,
// )
// @Index('deal_tenant_id_stage_index', ['tenantId', 'stage'])
@Index('deal_customer_id_index', ['customerId'])
@Index('deal_owner_id_index', ['ownerId'])
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'owner_id', type: 'uuid', nullable: true })
  ownerId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: User | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'EUR' })
  currency: string;

  // @Column({
  //   enum: DealStage,
  //   type: 'varchar',
  //   length: 100,
  //   default: DealStage.new,
  // })
  // stage: DealStage;
  @Column({ name: 'pipeline_stage_id', type: 'uuid', nullable: false })
  pipelineStageId: string;

  @ManyToOne(() => PipelineStage, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pipeline_stage_id' })
  pipelineStage: PipelineStage;

  @Column({ name: 'expected_close_date', type: 'date', nullable: true })
  expectedCloseDate: Date | null;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
