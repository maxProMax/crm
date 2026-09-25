import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreatePipelineDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;
}
