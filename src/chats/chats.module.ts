import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

import { Chat } from './entities/chat.entity';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Chat])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
