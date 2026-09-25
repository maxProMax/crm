import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { CustomerSource, CustomerStatus } from '../entities/customer.entity';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Transform(({ value: v }: { value: string }) =>
    v.trim() === '' ? undefined : v,
  )
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  companyName?: string;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsEnum(CustomerSource)
  source: CustomerSource;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}
