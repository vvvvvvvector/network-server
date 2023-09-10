import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from 'src/users/dtos/auth-user.dto';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfilesService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.userService.findUserByUsername(username);

    if (!user) {
      return null;
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

    return this.generateToken(payload);
  }

  async signUp(dto: SignUpUserDto) {
    await this.isUserAlreadyExists(dto.username, dto.email);

    const hash = await this.generateHash(dto.password);

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

  async activateProfile(uuid: string) {
    return this.profileService.activateProfile(uuid);
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

  private async generateHash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  private generateToken(payload: { id: number; username: string }) {
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
