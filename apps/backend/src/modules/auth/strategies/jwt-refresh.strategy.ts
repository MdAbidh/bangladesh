import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../../../common/interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies && req.cookies['refresh_token']) {
            return req.cookies['refresh_token'];
          }
          if (req && req.body && req.body.refreshToken) {
            return req.body.refreshToken;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      issuer: configService.get<string>('jwt.issuer'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    const refreshToken =
      (req.cookies && req.cookies['refresh_token']) ||
      (req.body && req.body.refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions || [],
      refreshToken,
    } as JwtPayload & { refreshToken: string };
  }
}
