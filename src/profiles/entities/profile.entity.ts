import {
  Entity,
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tables } from 'src/utils/constants';

@Entity({ name: Tables.PROFILES })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ default: false })
  isActivated: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @CreateDateColumn()
  createdAt: Date;

  // first arg: target relation type | second arg: inverse relation
  // if relation is not bi-directional, you can't use relations on profilesRepository (relations: ['user']), but you can use relations on usersRepository (relations: ['profile'])
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
