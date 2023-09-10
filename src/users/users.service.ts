import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpUserDto } from './dtos/auth-user.dto';
import { Profile } from 'src/profiles/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  private async getUserDataById(id: number) {
    try {
      const { password, ...data } = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['profile'],
      });

      return data;
    } catch (error) {
      throw new BadRequestException('User not found.');
    }
  }

  async getMe(id: number) {
    const data = await this.getUserDataById(id);

    return data;
  }

  async isProfileActivated(id: number) {
    const { profile } = await this.getUserDataById(id);

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
