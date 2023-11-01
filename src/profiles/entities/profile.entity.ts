import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { TABLES } from 'src/utils/constants';
import { Avatar } from './avatar.entity';

@Entity({ name: TABLES.PROFILES })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: false })
  isActivated: boolean;

  @OneToOne(() => Avatar, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'avatarId' })
  avatar: Avatar;

  @CreateDateColumn()
  createdAt: Date;

  // first arg: target relation type | second arg: inverse relation
  // if relation is not bi-directional, you can't use relations on profilesRepository (relations: ['user']), but you can use relations on usersRepository (relations: ['profile'])
  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column({ nullable: true })
  bio?: string;
}
