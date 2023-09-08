import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Routes } from 'src/utils/constants';
import { SignInUserDto } from 'src/users/dtos/signin-user.dto';
import { SignUpUserDto } from 'src/users/dtos/signup-user.dto';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Auth')
@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiBody({ type: SignInUserDto })
  signIn(@Req() req) {
    return req.user;
  }

  @Post('signup')
  signUp(@Body() dto: SignUpUserDto) {
    return 'hello world!!! [signup]';
  }
}
