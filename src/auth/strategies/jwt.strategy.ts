import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserTokenPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // strategy configuration here in super()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // makes sure that the token is not expired
      secretOrKey: process.env.JWT_SECRET, // used to verify token's signature
    });
  }

  // return from the validate method will be saved in the request (@Req | @Request) object
  async validate(payload: any): Promise<UserTokenPayload> {
    const { id, username } = payload;

    return { id, username }; // this object will be saved in the @Req() req.user
  }
}
