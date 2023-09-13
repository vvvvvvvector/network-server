import { Controller, Get, UseGuards, Post, Req, Body } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, SwaggerApiTags } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateRequsetDto } from './dtos/create-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SwaggerApiTags.FRIEND_REQUESTS)
@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post('create')
  create(@Req() req, @Body() dto: CreateRequsetDto) {
    return this.friendRequestsService.create(req.user.id, dto.username);
  }

  @Get('accepted')
  getAcceptedFriendRequests(@Req() req) {
    return this.friendRequestsService.getAcceptedFriendRequests(req.user.id);
  }

  @Get('received')
  getReceivedFriendRequests(@Req() req) {
    return this.friendRequestsService.getReceivedFriendRequests(req.user.id);
  }

  @Get('sent')
  getSentFriendRequests(@Req() req) {
    return this.friendRequestsService.getSentFriendRequests(req.user.id);
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
