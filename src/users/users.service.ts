import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpUserDto } from './dtos/signup-user.dto';
import { Profile } from 'src/profiles/profile.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  private async getUserDataById(id: number) {
    const { password, ...data } = await this.repository.findOne({
      where: { id },
      relations: ['profile'],
    });

    return data;
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
    const newUser = new User();

    newUser.username = dto.username;
    newUser.email = dto.email;
    newUser.password = dto.password;
    newUser.profile = new Profile();

    await this.repository.save(newUser);

    return { uuid: newUser.profile.uuid, email: newUser.email };
  }

  findUserByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  findUserByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }
}
