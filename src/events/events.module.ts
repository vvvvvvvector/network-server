import { Module } from '@nestjs/common';

import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';

import { EncapsulatedJwtModule } from 'src/modules/jwt.module';

@Module({
  imports: [EncapsulatedJwtModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
