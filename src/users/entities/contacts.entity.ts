import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from './email.entity';
import { User } from './user.entity';

@Entity({ name: 'contacts' })
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Email, { cascade: ['insert'] })
  @JoinColumn()
  email: Email;

  @OneToOne(() => User)
  user: User;
}
