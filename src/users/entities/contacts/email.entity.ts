import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Contacts } from './contacts.entity';

import { TABLES } from 'src/utils/constants';

@Entity({ name: TABLES.EMAILS })
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  contact: string;

  @Column({ default: true })
  isPublic: boolean;

  @OneToOne(() => Contacts)
  contacts: Contacts;
}
