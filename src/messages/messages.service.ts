import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(content: string, chatId: string, senderId: number) {
    const message = this.messagesRepository.create({
      content,
      chat: {
        id: chatId,
      },
      sender: {
        id: senderId,
      },
      createdAt: new Date(),
    });

    return this.messagesRepository.save(message);
  }
}
