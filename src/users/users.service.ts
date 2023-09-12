import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpUserDto } from './dtos/auth-user.dto';
import { Profile } from 'src/profiles/entities/profile.entity';
import { parseUserContacts } from './utils';

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

  async findUserByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async getAllUsersPublicAvailableData() {
    const qb = this.publicUserDataQB();

    const users = await qb.getMany();

    return users.map((user) => parseUserContacts(user));
  }

  async getUserPublicAvailableData(username: string) {
    try {
      const qb = this.publicUserDataQB();

      qb.where('user.username = :username', { username });

      const user = await qb.getOneOrFail();

      return parseUserContacts(user);
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  private publicUserDataQB() {
    const qb = this.usersRepository.createQueryBuilder('user');

    qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
      .leftJoin('user.contacts', 'contacts') // user.contacts references contacts property defined in the User entity
      .leftJoin('contacts.email', 'email') // conacts.email references email property defined in the Contacts entity
      .select([
        'user.username',
        'profile.isActivated',
        'profile.createdAt',
        'contacts',
        'email.contact',
        'email.isPublic',
      ]);

    return qb;
  }
}
