import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contacts } from './contacts.entity';

@Entity({ name: 'emailContacts' })
export class EmailContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isPublic: boolean;

  @OneToOne(() => Contacts)
  contacts: Contacts;
}
