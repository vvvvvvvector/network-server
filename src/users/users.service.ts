import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpUserDto } from './dtos/signup-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  findUserByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }

  createUser(dto: SignUpUserDto) {
    return this.repository.save(dto);
  }
}
