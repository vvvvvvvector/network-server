import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpUserDto } from './dtos/signup-user.dto';
import { Profile } from 'src/profiles/profile.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async getMe(id: number) {
    const { password, ...data } = await this.repository.findOne({
      where: { id },
      relations: ['profile'],
    });

    return data;
  }

  createUser(dto: SignUpUserDto) {
    const user = new User();

    user.username = dto.username;
    user.email = dto.email;
    user.password = dto.password;
    user.profile = new Profile();

    return this.repository.save(user);
  }

  findUserByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  findUserByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }
}
