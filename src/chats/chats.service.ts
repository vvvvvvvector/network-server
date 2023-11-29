import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Chat } from './entities/chat.entity';

import { UsersService } from 'src/users/users.service';

import { ChatAlreadyExistsException } from './exceptions/chat-already-exists';
import { ChatWithYourselfException } from './exceptions/chat-with-yourself';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private readonly usersService: UsersService,
  ) {}

  async initiateChat(signedInUserId: number, addresseeUsername: string) {
    const addresseeId =
      await this.usersService.findUserIdByUsername(addresseeUsername);

    if (signedInUserId === addresseeId) throw new ChatWithYourselfException();

    const existingChat = await this.chatsRepository.findOne({
      where: [
        {
          initiator: {
            id: signedInUserId,
          },
          addressee: {
            id: addresseeId,
          },
        },
        {
          initiator: {
            id: addresseeId,
          },
          addressee: {
            id: signedInUserId,
          },
        },
      ],
    });

    if (existingChat) throw new ChatAlreadyExistsException();

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

  async getAllAuthorizedUserChats(signedInUserId: number) {
    const chats = await this.chatsRepository.find({
      relations: [
        'initiator',
        'initiator.profile.avatar',
        'addressee',
        'addressee.profile.avatar',
      ],
      select: {
        id: true,
        lastMessageSentAt: true,
        lastMessageContent: true,
        addressee: {
          id: true,
          username: true,
          profile: {
            uuid: true,
            avatar: {
              name: true,
            },
          },
        },
        initiator: {
          id: true,
          username: true,
          profile: {
            uuid: true,
            avatar: {
              name: true,
            },
          },
        },
      },
      where: [
        {
          addressee: {
            id: signedInUserId,
          },
        },
        {
          initiator: {
            id: signedInUserId,
          },
        },
      ],
    });

    return chats.map((chat) => ({
      id: chat.id,
      friendUsername:
        chat.initiator.id === signedInUserId
          ? chat.addressee.username
          : chat.initiator.username,
      friendAvatar:
        chat.initiator.id === signedInUserId
          ? chat.addressee.profile.avatar.name
          : chat.initiator.profile.avatar.name,
      lastMessageContent: chat.lastMessageContent,
      lastMessageSentAt: chat.lastMessageSentAt,
    }));
  }
}
