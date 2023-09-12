import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contacts } from './contacts.entity';
import { Tables } from 'src/utils/constants';

@Entity({ name: Tables.EMAILS })
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
