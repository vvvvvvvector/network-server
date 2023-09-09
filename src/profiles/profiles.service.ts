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
      const profile = await this.profileRepository.findOne({ where: { uuid } });

      return profile;
    } catch (error) {
      throw new BadRequestException('Error while activating profile.');
    }
  }
}
