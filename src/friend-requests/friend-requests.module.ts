import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';

import { FriendRequest } from './entities/friend-request.entity';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([FriendRequest]),
  ],
  providers: [FriendRequestsService],
  controllers: [FriendRequestsController],
  exports: [FriendRequestsService],
})
export class FriendRequestsModule {}
