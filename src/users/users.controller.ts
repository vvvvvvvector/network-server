import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { SWAGGER_API_TAGS, ROUTES } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAGS.USERS)
@Controller(ROUTES.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get ALL data of a signed in user (except of hashed password)',
  })
  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.getUserById(req.user.id);
  }

  @Get('me/username-avatar')
  async getMyAvatarAndUsername(@Req() req) {
    return this.usersService.getUserAvatarAndUsername(req.user.id);
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

  @Patch('me/contacts/email/privacy')
  async toogleEmailPrivacy(@Req() req) {
    return this.usersService.toogleEmailPrivacy(req.user.id);
  }
}
