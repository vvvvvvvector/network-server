import { Module } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';

import { EncapsulatedJwtModule } from 'src/auth/modules/jwt.module';

import { MessagesModule } from 'src/messages/messages.module';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, ChatsModule, MessagesModule, EncapsulatedJwtModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
