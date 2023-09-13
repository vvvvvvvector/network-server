import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { MyselfFriendRequestException } from './exceptions/myself-friend-request';
import { RequestHasAlreadyBeenCreatedException } from './exceptions/request-has-already-been-created';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestsRepository: Repository<FriendRequest>,
    private readonly usersService: UsersService,
  ) {}

  async create(senderId: number, receiverUsername: string) {
    const receiverId =
      await this.usersService.findUserIdByUsername(receiverUsername);

    if (senderId === receiverId) throw new MyselfFriendRequestException();

    const alreadyFriends = await this.alreadyFriends(senderId, receiverId);

    if (alreadyFriends) throw new RequestHasAlreadyBeenCreatedException();

    const friendRequest = this.friendRequestsRepository.create({
      sender: {
        id: senderId,
      },
      receiver: {
        id: receiverId,
      },
      status: 'pending',
    });

    const newFriendRequest =
      await this.friendRequestsRepository.save(friendRequest);

    return newFriendRequest;
  }

  getAcceptedFriendRequests(signedInUserId: number) {
    return ['accepted friend1', 'accepted friend2', 'accepted friend3'];
  }

  getReceivedFriendRequests(signedInUserId: number) {
    return [
      'receiver friend1 request',
      'receiver friend2 request',
      'receiver friend3 request',
    ];
  }

  getSentFriendRequests(signedInUserId: number) {
    return [
      'send friend1 request',
      'send friend2 request',
      'send friend3 request',
    ];
  }

  accept() {
    return 'accepted';
  }

  reject() {
    return 'rejected';
  }

  private async alreadyFriends(senderId: number, receiverId: number) {
    const friendRequest = await this.friendRequestsRepository.findOne({
      where: [
        {
          sender: {
            id: senderId,
          },
          receiver: {
            id: receiverId,
          },
        },
        {
          sender: {
            id: receiverId,
          },
          receiver: {
            id: senderId,
          },
        },
      ],
    });

    return friendRequest;
  }
}
