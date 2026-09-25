import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreatePipelineStageDto {
  @IsUUID()
  pipelineId: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsInt()
  @Min(1)
  position: number;

  @IsOptional()
  @IsBoolean()
  isTerminal?: boolean = false;
}
