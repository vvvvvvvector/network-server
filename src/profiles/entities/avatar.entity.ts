import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TABLES } from 'src/utils/constants';
import { Profile } from './profile.entity';

@Entity({ name: TABLES.AVATARS })
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  likes?: number;

  @OneToOne(() => Profile)
  profile: Profile;
}
