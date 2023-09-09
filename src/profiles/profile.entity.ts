import { User } from 'src/users/user.entity';
import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: false })
  isActivated: boolean;

  @OneToOne(() => User)
  user: User;
}
