import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TenantPlan {
  Free = 'free',
  Pro = 'pro',
  Enterprise = 'enterprise',
}

export enum TenantStatus {
  Active = 'active',
  Suspended = 'suspended',
  Deleted = 'deleted',
}

@Entity({ name: 'tenants' })
@Check(
  'tenants_plan_check',
  `plan IN (${Object.values(TenantPlan)
    .map((v) => `'${v}'`)
    .join(',')})`,
)
@Check(
  'tenants_status_check',
  `status IN (${Object.values(TenantStatus)
    .map((v) => `'${v}'`)
    .join(',')})`,
)
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index('tenants_slug_uniq', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'varchar', length: 50, default: TenantPlan.Free })
  plan: TenantPlan;

  @Column({ type: 'varchar', length: 50, default: TenantStatus.Active })
  status: TenantStatus;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
