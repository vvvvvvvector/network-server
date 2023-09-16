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
import { Routes, SwaggerApiTags } from 'src/utils/constants';
import { SignInUserDto, SignUpUserDto } from 'src/users/dtos/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags(SwaggerApiTags.AUTH)
@Controller(Routes.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.activateProfile(uuid);
  }
}
