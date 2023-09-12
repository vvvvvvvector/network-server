import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailContact } from './emailContact.entity';
import { User } from './user.entity';

@Entity({ name: 'contacts' })
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => EmailContact, { cascade: ['insert'] })
  @JoinColumn()
  emailContact: EmailContact;

  @OneToOne(() => User)
  user: User;
}
