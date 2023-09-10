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

  private async getUserById(id: number) {
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

  async getUserData(id: number) {
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

  findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findUserByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
