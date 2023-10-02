import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SwaggerApiTags, Routes } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SwaggerApiTags.USERS)
@Controller(Routes.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.getUserById(req.user.id);
  }

  @Get('me/username')
  async getMyUsernameById(@Req() req) {
    return this.usersService.getMyUsernameById(req.user.id);
  }

  @Get(':username')
  async getUserPublicAvailableData(
    @Req() req,
    @Param('username') username: string,
  ) {
    return this.usersService.getUserPublicAvailableData(req.user.id, username);
  }

  @Get()
  async getAllUsersPublicAvailableData() {
    return this.usersService.getAllUsersPublicAvailableData();
  }
}
