import { Module } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';

import { EncapsulatedJwtModule } from 'src/modules/jwt.module';

import { MessagesModule } from 'src/messages/messages.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [ChatsModule, MessagesModule, EncapsulatedJwtModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
