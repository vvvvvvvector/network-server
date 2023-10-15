import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async networkUsersUsernames(
    signedInUserId: number,
    pageFromQuery: string,
    usernameFromQuery: string,
  ) {
    let users = (await this.usersService.getAllUsersUsernamesWithIds()).filter(
      (user) => user.id !== signedInUserId,
    );

    if (usernameFromQuery) {
      users = users.filter((user) =>
        user.username
          .toLowerCase()
          .includes(usernameFromQuery.toLocaleLowerCase()),
      );
    }

    const qb = this.friendRequestsRepository.createQueryBuilder('request');

    qb.leftJoin('request.sender', 'sender')
      .leftJoin('request.receiver', 'receiver')
      .select(['request.status', 'sender', 'receiver']);

    const requests = await qb.getMany();

    const page = +pageFromQuery || 1;
    const usersPerPage = 4;

    return {
      totalPages: Math.ceil(users.length / usersPerPage),
      users: users
        .slice((page - 1) * usersPerPage, usersPerPage * page)
        .map((user) => {
          let requestStatus = 'lack';

          for (let i = 0; i < requests.length; i++) {
            if (
              (requests[i].receiver.id === user.id &&
                requests[i].sender.id === signedInUserId) ||
              (requests[i].receiver.id === signedInUserId &&
                requests[i].sender.id === user.id)
            )
              requestStatus = requests[i].status;
          }

          return {
            username: user.username,
            profile: {
              ...user.profile,
            },
            requestStatus,
          };
        }),
    };
  }

  // de facto getMyFriendsUsernames
  async acceptedFriendRequests(
    signedInUserId: number,
    signedInUserUsername: string,
  ) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.sender', 'sender')
      .leftJoin('friendRequest.receiver', 'receiver')
      .leftJoin('receiver.profile', 'receiverProfile')
      .leftJoin('sender.profile', 'senderProfile')
      .select([
        'friendRequest.createdAt',
        'sender.username',
        'receiver.username',
        'receiverProfile.avatar',
        'senderProfile.avatar',
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
        profile:
          request.sender.username === signedInUserUsername
            ? request.receiver.profile
            : request.sender.profile,
      };
    });
  }

  async incomingFriendRequests(signedInUserId: number) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.sender', 'sender')
      .leftJoin('sender.profile', 'profile')
      .select(['friendRequest.createdAt', 'sender.username', 'profile.avatar'])
      .where('friendRequest.receiverId = :signedInUserId', {
        signedInUserId,
      })
      .andWhere('friendRequest.status = :status', { status: 'pending' });

    const incomingFriendRequests = await qb.getMany();

    return incomingFriendRequests;
  }

  async sentFriendRequests(signedInUserId: number) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.receiver', 'receiver')
      .leftJoin('receiver.profile', 'profile')
      .select([
        'friendRequest.createdAt',
        'receiver.username',
        'profile.avatar',
      ])
      .where('friendRequest.senderId = :signedInUserId', { signedInUserId })
      .andWhere('friendRequest.status IN (:...statuses)', {
        statuses: ['pending', 'rejected'],
      });

    const sentFriendRequests = await qb.getMany();

    return sentFriendRequests;
  }

  // which user has rejected
  async rejectedFriendRequests(signedInUserId: number) {
    const qb =
      this.friendRequestsRepository.createQueryBuilder('friendRequest');

    qb.leftJoin('friendRequest.sender', 'sender')
      .leftJoin('sender.profile', 'profile')
      .select(['friendRequest.createdAt', 'sender.username', 'profile.avatar'])
      .where('friendRequest.receiverId = :signedInUserId', {
        signedInUserId,
      })
      .andWhere('friendRequest.status = :status', { status: 'rejected' });

    const rejectedFriendRequests = await qb.getMany();

    return rejectedFriendRequests;
  }

  async accept(signedInUserUsername: string, requestSenderUsername: string) {
    try {
      const friendRequest = await this.friendRequestsRepository.findOne({
        where: {
          sender: {
            username: requestSenderUsername,
          },
          receiver: {
            username: signedInUserUsername,
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

  async reject(signedInUserUsername: string, requestSenderUsername: string) {
    try {
      const friendRequest = await this.friendRequestsRepository.findOneOrFail({
        where: {
          sender: {
            username: requestSenderUsername,
          },
          receiver: {
            username: signedInUserUsername,
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

  async unfriend(senderId: number, receiverUsername: string) {
    const receiverId =
      await this.usersService.findUserIdByUsername(receiverUsername);

    const friendRequest = await this.friendRequestsRepository.findOne({
      relations: ['receiver', 'sender'],
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

    friendRequest.sender.id = receiverId;
    friendRequest.receiver.id = senderId;
    friendRequest.status = 'rejected';

    return this.friendRequestsRepository.save(friendRequest);
  }

  async cancel(signedInUserUsername: string, receiverUsername: string) {
    const friendRequest = await this.friendRequestsRepository.findOne({
      relations: ['receiver', 'sender'],
      where: [
        {
          sender: {
            username: signedInUserUsername,
          },
          receiver: {
            username: receiverUsername,
          },
        },
      ],
    });

    return this.friendRequestsRepository.remove(friendRequest);
  }

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

  async alreadyFriends(senderId: number, receiverId: number) {
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

    return friendRequest?.status;
  }
}
