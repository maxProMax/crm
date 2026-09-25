import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
  //   console.log('JWT debug:', { err, user, info: info?.message ?? info });
  //   return super.handleRequest(err, user, info, context);
  // }
}
