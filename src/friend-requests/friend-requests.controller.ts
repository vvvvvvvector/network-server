import { Controller, Get, UseGuards } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { ApiTags } from '@nestjs/swagger';
import { Routes, SwaggerApiTags } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

// @UseGuards(JwtAuthGuard)
@ApiTags(SwaggerApiTags.FRIEND_REQUESTS)
@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Get('my-friends')
  getFriendsList() {
    return this.friendRequestsService.friendsList();
  }

  @Get('create')
  create() {
    return this.friendRequestsService.create();
  }

  @Get('accept')
  accept() {
    return this.friendRequestsService.accept();
  }

  @Get('reject')
  reject() {
    return this.friendRequestsService.reject();
  }
}
