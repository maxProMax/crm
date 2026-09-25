import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pipeline } from './pipeline.entity';

@Entity({ name: 'pipeline_stages' })
export class PipelineStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pipeline_id', type: 'uuid', nullable: false })
  pipelineId: string;

  @ManyToOne(() => Pipeline, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'pipeline_id' })
  pipeline: Pipeline;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  position: number;

  @Column({ name: 'is_terminal', type: 'boolean', default: false })
  isTerminal: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date | null;
}
