import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest])],
  providers: [FriendRequestsService],
  controllers: [FriendRequestsController],
})
export class FriendRequestsModule {}
