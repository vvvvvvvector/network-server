import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from 'src/users/dtos/signup-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  private generateAccessToken(payload: { id: number; username: string }) {
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const { id } = user;

      return { id, username };
    }

    return null;
  }

  signIn(user: { id: number; username: string }) {
    return this.generateAccessToken(user);
  }

  async signUp(dto: SignUpUserDto) {
    const user = await this.userService.findUserByUsername(dto.username);

    if (user) {
      throw new ForbiddenException('User with this username already exists.');
    }

    const hash = await this.generateHashedPassword(dto.password);

    const { id, username } = await this.userService.createUser({
      ...dto,
      password: hash,
    });

    return this.generateAccessToken({ id, username });
  }
}
