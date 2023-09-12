import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpUserDto } from './dtos/auth-user.dto';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Contacts } from './entities/contacts.entity';
import { EmailContact } from './entities/emailContact.entity';
import { parseContacts } from './utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['profile', 'contacts.emailContact'],
      });

      return user;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  private async getUserData(id: number) {
    const { password, ...user } = await this.getUserById(id);

    return user;
  }

  async isProfileActivated(id: number) {
    const { profile } = await this.getUserData(id);

    return profile.isActivated;
  }

  async createUser(dto: SignUpUserDto) {
    const contacts = new Contacts();
    const emailContact = new EmailContact();
    emailContact.email = dto.email;
    contacts.emailContact = emailContact;

    const user = this.usersRepository.create({
      username: dto.username,
      password: dto.password,
      profile: new Profile(),
      contacts,
    });

    const newUser = await this.usersRepository.save(user);

    return {
      uuid: newUser.profile.uuid,
      email: newUser.contacts.emailContact.email,
    };
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        contacts: {
          emailContact: {
            email,
          },
        },
      },
    });
  }

  async findUserByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async getAllUsers() {
    const qb = this.usersRepository.createQueryBuilder('user');

    qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
      .leftJoin('user.contacts', 'contacts')
      .leftJoin('contacts.emailContact', 'emailContact')
      .select([
        'user.username',
        'profile.isActivated',
        'profile.createdAt',
        'contacts.id',
        'contacts.emailContact',
        'emailContact.email',
        'emailContact.isPublic',
      ]);

    const users = await qb.getMany();

    return users.map((user) => parseContacts(user));
  }

  async getPublicUserData(username: string) {
    try {
      const qb = this.usersRepository.createQueryBuilder('user');

      qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
        .leftJoin('user.contacts', 'contacts')
        .leftJoin('contacts.emailContact', 'emailContact')
        .select([
          'user.username',
          'profile.isActivated',
          'profile.createdAt',
          'contacts.id',
          'contacts.emailContact',
          'emailContact.email',
          'emailContact.isPublic',
        ])
        .where('user.username = :username', { username });

      const user = await qb.getOneOrFail();

      return parseContacts(user);
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }
}
