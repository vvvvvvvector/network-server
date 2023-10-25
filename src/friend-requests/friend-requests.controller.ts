import {
  Controller,
  Get,
  UseGuards,
  Post,
  Req,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FriendRequestDto } from './dtos/friend-request.dto';

import { FriendRequestsService } from './friend-requests.service';

import { ROUTES, SWAGGER_API_TAGS } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags(SWAGGER_API_TAGS.FRIEND_REQUESTS)
@Controller(ROUTES.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @ApiOperation({
    summary: 'Send a friend request',
    description: 'Sends a friend request to a user',
  })
  @Post('create')
  async create(@Req() req, @Body() dto: FriendRequestDto) {
    return this.friendRequestsService.create(req.user.id, dto.username);
  }

  @ApiOperation({
    summary: 'List of your friends',
    description: 'Returns list of users who are your friends',
  })
  @Get('accepted')
  async acceptedFriendRequests(@Req() req) {
    return this.friendRequestsService.acceptedFriendRequests(
      req.user.id,
      req.user.username,
    );
  }

  @ApiOperation({
    summary: 'List of incoming friend requests',
    description: 'Returns list of users who have send a friend request to you',
  })
  @Get('incoming')
  async incomingFriendRequests(@Req() req) {
    return this.friendRequestsService.incomingFriendRequests(req.user.id);
  }

  @ApiOperation({
    summary: 'List of friend requests sent by you',
    description:
      'Returns list of users who have received a friend request from you',
  })
  @Get('sent')
  async sentFriendRequests(@Req() req) {
    return this.friendRequestsService.sentFriendRequests(req.user.id);
  }

  @ApiOperation({
    summary: 'List of friend requests rejected by you',
    description: 'Returns list of users who have been rejected by you',
  })
  @Get('rejected')
  async rejectedFriendRequests(@Req() req) {
    return this.friendRequestsService.rejectedFriendRequests(req.user.id);
  }

  @ApiOperation({
    summary: 'List of users of entire network',
    description:
      'Returns list of users of entire network per page, with information about request status',
  })
  @Get('find')
  async networkUsersUsernames(
    @Req() req,
    @Query()
    query: {
      page: string;
      username: string;
    },
  ) {
    return this.friendRequestsService.networkUsersUsernames(
      req.user.id,
      query.page,
      query.username,
    );
  }

  @ApiOperation({
    summary: 'Allow you to accept a friend request',
  })
  @Patch('accept')
  async accept(@Req() req, @Body() dto: FriendRequestDto) {
    return this.friendRequestsService.accept(req.user.username, dto.username);
  }

  @ApiOperation({
    summary: 'Allow you to reject a friend request',
  })
  @Patch('reject')
  async reject(@Req() req, @Body() dto: FriendRequestDto) {
    return this.friendRequestsService.reject(req.user.username, dto.username);
  }

  @ApiOperation({
    summary: 'Allow you to unfriend a friend :D',
  })
  @Patch('unfriend')
  async unfriend(@Req() req, @Body() dto: FriendRequestDto) {
    return this.friendRequestsService.unfriend(req.user.id, dto.username);
  }

  @ApiOperation({
    summary: 'Cancel a friend request sent by you',
    description: 'Delete from database a friend request sent by you',
  })
  @Delete('cancel')
  async cancel(@Req() req, @Body() dto: FriendRequestDto) {
    return this.friendRequestsService.cancel(req.user.username, dto.username);
  }
}
