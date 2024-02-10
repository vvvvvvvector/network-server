import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { getSignedInUserDataQueryBuilder, parseUserContacts } from './utils';

import { User } from './entities/user.entity';

import { SignUpUserDto } from './dtos/auth.dto';

import { Profile } from 'src/profiles/entities/profile.entity';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { Avatar } from 'src/profiles/entities/avatar.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => FriendRequestsService))
    private readonly friendRequestsService: FriendRequestsService,
  ) {}

  async getMyUsernameById(id: number) {
    try {
      const { username } = await this.usersRepository.findOneOrFail({
        where: { id },
      });

      return {
        username,
      };
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async getUserById(id: number) {
    try {
      const qb = getSignedInUserDataQueryBuilder(
        this.usersRepository.createQueryBuilder('user'),
      );

      const user = await qb.where('user.id = :id', { id }).getOneOrFail();

      const { contacts, ...rest } = user;

      return {
        ...rest,
        contacts: {
          email: contacts.email,
        },
      };
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async getUserAvatarAndUsername(id: number) {
    try {
      // eslint-disable-next-line
      const { password, ...user } = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['profile', 'profile.avatar'],
      });

      return {
        username: user.username,
        avatar: user.profile.avatar.name
          ? { name: user.profile.avatar.name }
          : null,
      };
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async isProfileActivated(id: number) {
    const { profile } = await this.getUserById(id);

    return profile.isActivated;
  }

  async createUser(dto: SignUpUserDto) {
    const profile = new Profile();

    profile.createdAt = new Date();
    profile.avatar = new Avatar();

    const user = this.usersRepository.create({
      username: dto.username,
      password: dto.password,
      profile,
      contacts: {
        email: {
          contact: dto.email,
        },
      },
    });

    const newUser = await this.usersRepository.save(user);

    return {
      uuid: newUser.profile.uuid,
      email: newUser.contacts.email.contact,
    };
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        contacts: {
          email: {
            contact: email,
          },
        },
      },
    });
  }

  async findUserIdByUsername(username: string) {
    try {
      const { id } = await this.usersRepository.findOneOrFail({
        where: {
          username,
        },
      });

      return id;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['profile'],
    });

    return user;
  }

  async getAllUsersUsernamesWithIds() {
    const users = await this.usersRepository.find({
      relations: ['profile', 'profile.avatar'],
      select: {
        id: true,
        username: true,
        profile: {
          uuid: true,
          avatar: {
            name: true,
          },
        },
      },
    });

    return users;
  }

  async getUserPublicAvailableData(signedInUserId: number, username: string) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        relations: ['profile', 'profile.avatar', 'contacts', 'contacts.email'],
        select: {
          id: true,
          username: true,
          lastSeen: true,
          profile: {
            isActivated: true,
            createdAt: true,
            bio: true,
            avatar: {
              name: true,
              likes: true,
            },
          },
          contacts: {
            id: true,
            email: {
              contact: true,
              isPublic: true,
            },
          },
        },
        where: {
          username,
        },
      });

      const friendRequest = await this.friendRequestsService.alreadyFriends(
        signedInUserId,
        user.id,
      );

      let extendedFriendRequestStatus = '';

      switch (friendRequest?.status) {
        case 'accepted':
          extendedFriendRequestStatus = 'friend';

          break;
        case 'pending':
          extendedFriendRequestStatus =
            friendRequest.sender.id === signedInUserId
              ? 'pending:receiver'
              : 'pending:sender';

          break;
        case 'rejected':
          extendedFriendRequestStatus =
            friendRequest.sender.id === signedInUserId
              ? 'pending:receiver'
              : 'rejected:sender';

          break;
        default:
          extendedFriendRequestStatus = 'none';

          break;
      }

      return { extendedFriendRequestStatus, ...parseUserContacts(user) };
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async toogleEmailPrivacy(id: number) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['contacts', 'contacts.email'],
      });

      user.contacts.email.isPublic = !user.contacts.email.isPublic;

      const newUser = await this.usersRepository.save(user);

      return {
        email: {
          isPublic: newUser.contacts.email.isPublic,
        },
      };
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async updateLastSeenDateAndTime(id: number) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
      });

      user.lastSeen = new Date();

      await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }
}
