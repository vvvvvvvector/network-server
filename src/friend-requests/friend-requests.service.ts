import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { UsersService } from 'src/users/users.service';
import { MyselfFriendRequestException } from './exceptions/myself-friend-request';
import { RequestHasAlreadyBeenCreatedException } from './exceptions/request-has-already-been-created';
import { NotReceiverRejectException } from './exceptions/not-receiver-reject';
import { NotReceiverAcceptException } from './exceptions/not-receiver-accept';

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

  // de facto getMyFriendsUsernames
  async getAcceptedFriendRequests(
    signedInUserId: number,
    signedInUserUsername: string,
  ) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.sender', 'sender')
      .leftJoin('friendRequest.receiver', 'receiver')
      .select([
        'friendRequest.createdAt',
        'sender.username',
        'receiver.username',
      ])
      .where(
        'friendRequest.senderId = :signedInUserId AND friendRequest.status = :status',
        {
          signedInUserId,
          status: 'accepted',
        },
      )
      .orWhere(
        'friendRequest.receiverId = :signedInUserId AND friendRequest.status = :status',
        {
          signedInUserId,
          status: 'accepted',
        },
      );

    const acceptedFriendRequests = await qb.getMany();

    return acceptedFriendRequests.map((request) => {
      return {
        username:
          request.sender.username === signedInUserUsername
            ? request.receiver.username
            : request.sender.username,
      };
    });
  }

  async getIncomingFriendRequests(signedInUserId: number) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.sender', 'sender')
      .select(['friendRequest.createdAt', 'sender.username'])
      .where('friendRequest.receiverId = :signedInUserId', {
        signedInUserId,
      })
      .andWhere('friendRequest.status = :status', { status: 'pending' });

    const incomingFriendRequests = await qb.getMany();

    return incomingFriendRequests;
  }

  async getSentFriendRequests(signedInUserId: number) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.receiver', 'receiver')
      .select(['friendRequest.createdAt', 'receiver.username'])
      .where('friendRequest.senderId = :signedInUserId', { signedInUserId })
      .andWhere(
        'friendRequest.status = :firstStatus OR friendRequest.status = :secondStatus',
        { firstStatus: 'pending', secondStatus: 'rejected' },
      );

    const sentFriendRequests = await qb.getMany();

    return sentFriendRequests;
  }

  // which user has rejected
  async getRejectedFriendRequests(signedInUserId: number) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.sender', 'sender')
      .select(['friendRequest.createdAt', 'sender.username'])
      .where('friendRequest.receiverId = :signedInUserId', {
        signedInUserId,
      })
      .andWhere('friendRequest.status = :status', { status: 'rejected' });

    const rejectedFriendRequests = await qb.getMany();

    return rejectedFriendRequests;
  }

  async accept(signedInUserId: number, requestSenderUsername: string) {
    const senderId = await this.usersService.findUserIdByUsername(
      requestSenderUsername,
    );

    try {
      const friendRequest = await this.friendRequestsRepository.findOne({
        where: {
          sender: {
            id: senderId,
          },
          receiver: {
            id: signedInUserId,
          },
        },
      });

      friendRequest.status = 'accepted';

      const acceptedFriendRequest =
        await this.friendRequestsRepository.save(friendRequest);

      return acceptedFriendRequest;
    } catch (error) {
      throw new NotReceiverAcceptException();
    }
  }

  async reject(signedInUserId: number, requestSenderUsername: string) {
    const senderId = await this.usersService.findUserIdByUsername(
      requestSenderUsername,
    );

    try {
      const friendRequest = await this.friendRequestsRepository.findOneOrFail({
        where: {
          sender: {
            id: senderId,
          },
          receiver: {
            id: signedInUserId,
          },
        },
      });

      friendRequest.status = 'rejected';

      const rejectedFriendRequest =
        await this.friendRequestsRepository.save(friendRequest);

      return rejectedFriendRequest;
    } catch (error) {
      throw new NotReceiverRejectException();
    }
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
