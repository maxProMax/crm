import { User } from '../../../modules/users/entities/user.entity';
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

export enum CustomerStatus {
  lead = 'lead',
  active = 'active',
  inactive = 'inactive',
  lost = 'lost',
}
export enum CustomerSource {
  website = 'website',
  referral = 'referral',
  cold_call = 'cold_call',
  event = 'event',
  other = 'other',
}

@Entity({ name: 'customers' })
@Index(`customers_tenant_id_index`, ['tenantId'])
@Index(`customers_assigned_to_index`, ['assignedTo'])
@Index('customers_tenant_email_index_unique', ['tenantId', 'email'], {
  unique: true,
  where: `"email" IS NOT NULL AND "deleted_at" IS NULL`,
})
@Check(
  'customer_status_check',
  `status IN (${Object.values(CustomerStatus)
    .map((v) => `'${v}'`)
    .join(',')})`,
)
@Check(
  'customer_source_check',
  `source IN (${Object.values(CustomerSource)
    .map((v) => `'${v}'`)
    .join(',')})`,
)
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string | null;

  @Column({
    name: 'company_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  companyName: string | null;

  @Column({
    enum: CustomerStatus,
    type: 'varchar',
    length: 255,
    default: CustomerStatus.lead,
  })
  status: CustomerStatus;

  @Column({ enum: CustomerSource, type: 'varchar', length: 255 })
  source: CustomerSource;

  @Column({ name: 'assigned_to', type: 'uuid', nullable: true })
  assignedTo: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to' })
  assignedUser: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
