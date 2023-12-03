import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    FriendRequestsModule,
    MessagesModule,
    ChatsModule,
    EventsModule,
    ConfigModule.forRoot({
      envFilePath: ['.development.env'],
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_POSTGRES_HOST,
      password: process.env.DB_POSTGRES_PASSWORD,
      username: process.env.DB_POSTGRES_USERNAME,
      database: process.env.DB_POSTGRES_DATABASE,
      entities: ['**/*.entity.js'],
      synchronize: process.env.ENVIROMENT === 'dev',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
