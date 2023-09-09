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
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async signIn(payload: { id: number; username: string }) {
    const activated = await this.userService.isProfileActivated(payload.id);

    if (!activated) {
      throw new UnauthorizedException('This profile is not activated.'); // To do: change error message
    }

    return this.generateAccessToken(payload);
  }

  async signUp(dto: SignUpUserDto) {
    await this.isUserAlreadyExists(dto.username, dto.email);

    const hash = await this.generateHashedPassword(dto.password);

    const { uuid, email } = await this.userService.createUser({
      ...dto,
      password: hash,
    });

    const link = `${process.env.API_URL}/auth/activate/${uuid}`;

    // To Do: send email with the activation link

    return {
      message: 'Activation link was successfully sent to e-mail.',
      statusCode: 201,
      receiver: email,
      link,
    };
  }

  private async isUserAlreadyExists(username: string, email: string) {
    const userByUsername = await this.userService.findUserByUsername(username);

    if (userByUsername) {
      throw new ForbiddenException('User with this username already exists.');
    }

    const userByEmail = await this.userService.findUserByEmail(email);

    if (userByEmail) {
      throw new ForbiddenException('User with this e-mail already exists.');
    }
  }

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
}
