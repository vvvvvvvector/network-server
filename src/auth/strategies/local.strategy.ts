import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // stragegy configuration here in super()
    super();
  }

  // return from the validate method will be saved in the request (req.user) (@Req | @Request) object
  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Wrong username or password.');
    }

    return user; // this object will be saved in the @Req() req.user
  }
}
