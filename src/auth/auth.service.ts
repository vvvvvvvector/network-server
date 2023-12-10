import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { ProfileNotActivatedException } from './exceptions/profile-not-activated';
import { UsernameExistsException } from './exceptions/username-exists';
import { EmailExistsException } from './exceptions/email-exists';

import { SignUpUserDto } from 'src/users/dtos/auth.dto';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';

export type UserTokenPayload = {
  id: number;
  username: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserTokenPayload> {
    const user = await this.usersService.findUserByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return { id: user.id, username: user.username };
    }

    return null;
  }

  async signIn(payload: UserTokenPayload) {
    const activated = await this.usersService.isProfileActivated(payload.id);

    if (!activated) {
      throw new ProfileNotActivatedException();
    }

    return this.generateToken(payload);
  }

  async signUp(dto: SignUpUserDto) {
    await this.isUserAlreadyExists(dto.username, dto.email);

    const hash = await this.generateHash(dto.password);

    const { uuid, email } = await this.usersService.createUser({
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
    return this.profilesService.activateProfile(uuid);
  }

  private async isUserAlreadyExists(username: string, email: string) {
    const userByUsername = await this.usersService.findUserByUsername(username);

    if (userByUsername) throw new UsernameExistsException();

    const userByEmail = await this.usersService.findUserByEmail(email);

    if (userByEmail) throw new EmailExistsException();
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
