import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Chat } from './entities/chat.entity';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private readonly usersService: UsersService,
  ) {}

  async initiateChat(signedInUserId: number, addresseeUsername: string) {
    const addresseeId =
      await this.usersService.findUserIdByUsername(addresseeUsername);

    const chat = this.chatsRepository.create({
      initiator: {
        id: signedInUserId,
      },
      addressee: {
        id: addresseeId,
      },
      lastMessageSentAt: null,
      lastMessageContent: null,
    });

    const newChat = await this.chatsRepository.save(chat);

    return newChat;
  }
}
