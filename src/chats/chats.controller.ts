import { Controller, Get, Req, Post, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ChatsService } from './chats.service';

import { ROUTES, SWAGGER_API_TAGS } from 'src/utils/constants';
import { InitiateChatDto } from './dtos/initate-chat.dto';

@Controller(ROUTES.CHATS)
@ApiTags(SWAGGER_API_TAGS.CHATS)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  getAllAuthorizedUserChats(@Req() req) {
    return 'get all my chats';
  }

  @Get(':chatId')
  getChatById(@Param('chatId') chatId: string) {
    return `chat id: ${chatId}`;
  }

  @Post()
  initiateChat(
    @Req() req,
    @Body()
    dto: InitiateChatDto,
  ) {
    return 'init a chat';
  }
}
