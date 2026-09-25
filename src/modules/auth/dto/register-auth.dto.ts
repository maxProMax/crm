import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

class RegisterTenantDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsString()
  @Length(2, 100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must contain only lowercase letters, digits and hyphens',
  })
  slug: string;
}
class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Length(2, 100)
  firstName: string;

  @IsString()
  @Length(2, 100)
  lastName: string;
}
export class RegisterDto {
  @ValidateNested()
  @Type(() => RegisterTenantDto)
  tenant: RegisterTenantDto;

  @ValidateNested()
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;
}
