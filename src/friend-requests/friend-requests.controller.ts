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
  async create(@Req() req, @Body() dto: CreateRequsetDto) {
    return this.friendRequestsService.create(req.user.id, dto.username);
  }

  @Get('accepted')
  async getAcceptedFriendRequests(@Req() req) {
    return this.friendRequestsService.getAcceptedFriendRequests(
      req.user.id,
      req.user.username,
    );
  }

  @Get('incoming')
  async getIncomingFriendRequests(@Req() req) {
    return this.friendRequestsService.getIncomingFriendRequests(req.user.id);
  }

  @Get('sent')
  async getSentFriendRequests(@Req() req) {
    return this.friendRequestsService.getSentFriendRequests(req.user.id);
  }

  @Post('accept')
  accept(@Req() req, @Body() dto: any) {
    return this.friendRequestsService.accept();
  }

  @Post('reject')
  reject(@Req() req, @Body() dto: any) {
    return this.friendRequestsService.reject();
  }
}
