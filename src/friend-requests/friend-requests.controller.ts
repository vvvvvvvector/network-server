import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Body,
  Patch,
} from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, SwaggerApiTags } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateFriendRequestDto } from './dtos/create-friend-request.dto';
import { AcceptFriendRequestDto } from './dtos/accept-friend-request.dto';
import { RejectFriendRequestDto } from './dtos/reject-friend-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SwaggerApiTags.FRIEND_REQUESTS)
@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @Post('create')
  async create(@Req() req, @Body() dto: CreateFriendRequestDto) {
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

  @Get('rejected')
  async getRejectedFriendRequests(@Req() req) {
    return this.friendRequestsService.getRejectedFriendRequests(req.user.id);
  }

  @Patch('accept')
  async accept(@Req() req, @Body() dto: AcceptFriendRequestDto) {
    return this.friendRequestsService.accept(req.user.id, dto.username);
  }

  @Patch('reject')
  async reject(@Req() req, @Body() dto: RejectFriendRequestDto) {
    return this.friendRequestsService.reject(req.user.id, dto.username);
  }
}
