import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { AuthJWTPayload } from '../types/auth.jwtPayload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';
// defaylt name is "jwt" but for the refresh token we need to change it to "refresh-jwt"
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: refreshTokenConfig.secret!, // decrypt the token
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  // request.user
  async validate(req: Request, payload: AuthJWTPayload) {
    const userId = payload.sub;

    const refreshToken = req.body.refresh;
    // TODO : WE NEED TO PASS THE BROWSER SESSION ID
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
