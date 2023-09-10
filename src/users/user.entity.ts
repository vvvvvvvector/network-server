import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from 'src/profiles/profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, { cascade: true, onDelete: 'CASCADE' }) // with 'cascade: true' i can save this relation with only one save call
  @JoinColumn({ name: 'profileUuid' }) // add column with foreign keys called 'profileUuid'
  profile: Profile;
}
