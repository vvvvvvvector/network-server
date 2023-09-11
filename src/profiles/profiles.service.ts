import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

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
