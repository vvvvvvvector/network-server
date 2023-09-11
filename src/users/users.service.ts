import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpUserDto } from './dtos/auth-user.dto';
import { Profile } from 'src/profiles/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUserById(id: number) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['profile'],
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
    const user = this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      profile: new Profile(),
    });

    const newUser = await this.usersRepository.save(user);

    return { uuid: newUser.profile.uuid, email: newUser.email };
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async getAllUsers() {
    const qb = this.usersRepository.createQueryBuilder('user');

    qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
      .select([
        'user.username',
        'user.email',
        'profile.isActivated',
        'profile.createdAt',
      ]);

    return qb.getMany();
  }

  async getPublicUserData(username: string) {
    try {
      const qb = this.usersRepository.createQueryBuilder('user');

      qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
        .select([
          'user.username',
          'user.email',
          'profile.isActivated',
          'profile.createdAt',
        ])
        .where('user.username = :username', { username });

      const user = await qb.getOneOrFail();

      return user;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }
}
