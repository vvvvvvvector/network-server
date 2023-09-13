import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpUserDto } from './dtos/auth-user.dto';
import { Profile } from 'src/profiles/entities/profile.entity';
import { getPublicUserDataQueryBuilder, parseUserContacts } from './utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUserById(id: number) {
    try {
      const { password, ...user } = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['profile', 'contacts.email'],
      });

      return user;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async isProfileActivated(id: number) {
    const { profile } = await this.getUserById(id);

    return profile.isActivated;
  }

  async createUser(dto: SignUpUserDto) {
    const user = this.usersRepository.create({
      username: dto.username,
      password: dto.password,
      profile: new Profile(),
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
    return this.usersRepository.findOneBy({ username });
  }

  async getAllUsersPublicAvailableData() {
    const qb = getPublicUserDataQueryBuilder(
      this.usersRepository.createQueryBuilder('user'),
    );

    const users = await qb.getMany();

    return users.map((user) => parseUserContacts(user));
  }

  async getUserPublicAvailableData(username: string) {
    try {
      const qb = getPublicUserDataQueryBuilder(
        this.usersRepository.createQueryBuilder('user'),
      );

      qb.where('user.username = :username', { username });

      const user = await qb.getOneOrFail();

      return parseUserContacts(user);
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }
}
