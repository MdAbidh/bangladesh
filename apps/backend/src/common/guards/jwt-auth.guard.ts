import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: Error, user: unknown, info: Error | string) {
    if (err || !user) {
      if (info instanceof Error) {
        const messages: Record<string, string> = {
          'JsonWebTokenError': 'Invalid token',
          'TokenExpiredError': 'Token has expired',
          'NotBeforeError': 'Token is not yet active',
        };
        throw new UnauthorizedException(messages[info.name] || info.message);
      }
      throw new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
