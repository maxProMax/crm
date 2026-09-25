import { UserRole } from '../../roles/entities/user-role.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// CREATE TABLE users (
//     id UUID PRIMARY KEY,
//     tenant_id UUID NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     password_hash VARCHAR(255) NOT NULL,
//     first_name VARCHAR(100) NOT NULL,
//     last_name VARCHAR(100) NOT NULL,
//     status VARCHAR(50) NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
//     deleted_at TIMESTAMP,
//     CONSTRAINT fk_tenant
//         FOREIGN KEY (tenant_id) REFERENCES tenants(id),

//     CONSTRAINT user_status_check
//         CHECK (status IN ('active', 'invited', 'suspended')),

//     CONSTRAINT users_tenant_email_unique
//         UNIQUE (tenant_id, email)
// );

export enum UserStatus {
  Active = 'active',
  Invited = 'invited',
  Suspended = 'suspended',
}

@Entity({ name: 'users' })
@Index('users_tenant_id_email_unique', ['tenantId', 'email'], { unique: true })
@Check(
  'users_status_check',
  `status IN (${Object.values(UserStatus)
    .map((v) => `'${v}'`)
    .join(',')})`,
)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ enum: UserStatus, length: 50, default: UserStatus.Invited })
  status: UserStatus;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date | null;
}
