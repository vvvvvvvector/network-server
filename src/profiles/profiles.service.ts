import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from './entities/profile.entity';

import { unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async removeAvatar(uuid: string) {
    const profile = await this.getProfileByUuid(uuid);

    unlink(
      join(__dirname, `../../uploads/avatars/${profile.avatar}`),
      (err) => {
        if (err) {
          console.log(err);

          throw new ForbiddenException('Error while removing avatar.');
        }
      },
    );

    profile.avatar = null;

    return this.profilesRepository.save(profile);
  }

  async saveAvatar(uuid: string, filename: string) {
    const profile = await this.getProfileByUuid(uuid);

    profile.avatar = filename;

    return this.profilesRepository.save(profile);
  }

  async activateProfile(uuid: string) {
    const profile = await this.getProfileByUuid(uuid);

    profile.isActivated = true;

    return this.profilesRepository.save(profile);
  }

  private async getProfileByUuid(uuid: string) {
    try {
      const profile = await this.profilesRepository.findOneOrFail({
        where: { uuid },
      });

      return profile;
    } catch (error) {
      throw new BadRequestException('Profile not found.');
    }
  }

  private async getProfileByUserId(id: number) {
    try {
      const profile = await this.profilesRepository.findOneOrFail({
        where: { user: { id } },
        relations: ['user'],
      });

      return profile;
    } catch (error) {
      throw new BadRequestException('Profile not found.');
    }
  }
}
