import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Routes } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('users')
@Controller(Routes.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.getUserById(req.user.id);
  }

  @Get(':username')
  async getUserPublicAbailableDataData(@Param('username') username: string) {
    return this.usersService.getUserPublicAvailableData(username);
  }

  @Get()
  async getAllUsersPublicAvailableData() {
    return this.usersService.getAllUsersPublicAvailableData();
  }
}
