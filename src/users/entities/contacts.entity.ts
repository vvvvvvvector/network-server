import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Email } from './email.entity';
import { User } from './user.entity';

import { TABLES } from 'src/utils/constants';

@Entity({ name: TABLES.CONTACTS })
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Email, { cascade: ['insert', 'update'] })
  @JoinColumn()
  email: Email;

  @OneToOne(() => User)
  user: User;
}
