import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Routes } from 'src/utils/constants';
import { SignInUserDto } from 'src/users/dtos/signin-user.dto';
import { SignUpUserDto } from 'src/users/dtos/signup-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ProfilesService } from 'src/profiles/profiles.service';

@ApiTags('Auth')
@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfilesService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInUserDto })
  @Post('signin')
  async signIn(@Req() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  async signUp(@Body() dto: SignUpUserDto) {
    return this.authService.signUp(dto);
  }

  @Get('activate/:uuid')
  async activateProfile(@Param('uuid') uuid: string) {
    return this.profileService.activateProfile(uuid);
  }
}
