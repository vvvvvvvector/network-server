import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: +configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
