import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ActivityStatus, ActivityType } from '../entities/activity.entity';

export class CreateActivityDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsOptional()
  @IsEnum(ActivityStatus)
  status?: ActivityStatus;

  @IsOptional()
  @IsUUID()
  dealId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
