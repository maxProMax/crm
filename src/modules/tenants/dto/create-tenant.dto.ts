import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { TenantPlan, TenantStatus } from '../entities/tenant.entity';

export class CreateTenantDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsString()
  @Length(2, 100)
  @Matches(/^[a-z0-9-]+$/)
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TenantPlan)
  plan?: TenantPlan;

  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}
