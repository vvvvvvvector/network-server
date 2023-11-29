import {
  Controller,
  Get,
  Req,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ChatsService } from './chats.service';

import { ROUTES, SWAGGER_API_TAGS } from 'src/utils/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { InitiateChatDto } from './dtos/initate-chat.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  async initiateChat(
    @Req() req,
    @Body()
    dto: InitiateChatDto,
  ) {
    return this.chatsService.initiateChat(req.user.id, dto.addresseeUsername);
  }
}
