import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserStatus } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from '../../../common/auth/type';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub);

    if (!user || user.status !== UserStatus.Active) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      tenantId: payload.tenantId,
      email: payload.email,
      isSuperAdmin: payload.isSuperAdmin,
    };
  }
}
