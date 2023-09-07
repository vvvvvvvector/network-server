import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Routes } from 'src/utils/constants';

@ApiTags('Auth')
@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signin')
  signIn() {
    return this.authService.signIn();
  }

  @Get('signup')
  signUp() {
    return this.authService.signUp();
  }
}
