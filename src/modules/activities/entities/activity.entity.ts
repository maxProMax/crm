import { get_CHECK_IN_Values } from '../../../common/db/utils';
import { Customer } from '../../../modules/customers/entities/customer.entity';
import { Deal } from '../../../modules/deals/entities/deal.entity';
import { Tenant } from '../../../modules/tenants/entities/tenant.entity';
import { User } from '../../../modules/users/entities/user.entity';
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

export enum ActivityType {
  call = 'call',
  meeting = 'meeting',
  task = 'task',
}
export enum ActivityStatus {
  pending = 'pending',
  done = 'done',
  canceled = 'canceled',
}

@Entity({ name: 'activities' })
@Check(
  'activities_type_check',
  `type in (${get_CHECK_IN_Values(ActivityType)})`,
)
@Check(
  'activities_status_check',
  `status in (${get_CHECK_IN_Values(ActivityStatus)})`,
)
@Index('idx_activities_tenant_id_customer_id', ['tenantId', 'customerId'])
@Index('idx_activities_tenant_id_deal_id', ['tenantId', 'dealId'])
@Index('idx_activities_tenant_id_assigned_to', ['tenantId', 'assignedToId'])
@Index('idx_activities_tenant_id_status', ['tenantId', 'status'])
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ enum: ActivityType, type: 'varchar', length: 50 })
  type: ActivityType;

  @Column({
    enum: ActivityStatus,
    type: 'varchar',
    length: 50,
    default: ActivityStatus.pending,
  })
  status: ActivityStatus;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'deal_id', type: 'uuid', nullable: true })
  dealId: string | null;

  @ManyToOne(() => Deal, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deal_id' })
  deal: Deal | null;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User | null;

  @Column({ name: 'assigned_to_id', type: 'uuid', nullable: true })
  assignedToId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User | null;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
