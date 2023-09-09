import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async activateProfile(uuid: string) {
    try {
      await this.profileRepository.update(uuid, {
        isActivated: true,
      });

      return {
        message: 'Profile was successfully activated.',
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Bad activation link.');
    }
  }
}
