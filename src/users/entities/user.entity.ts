import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { Contacts } from './contacts.entity';

import { Profile } from 'src/profiles/entities/profile.entity';
import { TABLES } from 'src/utils/constants';
import { Message } from 'src/messages/entities/message.entity';

@Entity({ name: TABLES.USERS })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @UpdateDateColumn({ nullable: true, default: null })
  lastSeen: Date;

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  // first arg: target relation type | second arg: inverse relation
  // if relation is not bi-directional, you can't use relations on profilesRepository (relations: ['user']), but you can use relations on usersRepository (relations: ['profile'])
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: ['insert'],
  }) // with 'cascade: true' i can save this relation with only one save call
  @JoinColumn({ name: 'profileUuid' }) // add column with foreign keys called 'profileUuid'
  profile: Profile;

  @OneToOne(() => Contacts, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'contactsId' })
  contacts: Contacts;
}
