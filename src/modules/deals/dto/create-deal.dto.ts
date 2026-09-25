import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

// import { DealStage } from '../entities/deal.entity';

export class CreateDealDto {
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Transform(({ value: v }: { value: string }) =>
    typeof v === 'string' ? v.trim().toUpperCase() : v,
  )
  currency: string;

  @IsUUID()
  pipelineStageId: string;
  // @IsEnum(DealStage)
  // stage: DealStage;

  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'expectedCloseDate must be in YYYY-MM-DD format',
  })
  expectedCloseDate?: string;
}
