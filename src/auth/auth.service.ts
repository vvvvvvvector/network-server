import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from 'src/users/dtos/signup-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.userService.getUserByUsername(username);

    if (user && user.password === password) {
      const { id, username } = user;

      return { id, username };
    }

    return null;
  }

  signIn(user: { id: number; username: string }) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  signUp(dto: SignUpUserDto) {
    return 'User was created!';
  }
}
