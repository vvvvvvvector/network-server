import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RequestStatus } from '../utils';
import { User } from 'src/users/entities/user.entity';
import { Tables } from 'src/utils/constants';

@Entity({ name: Tables.FRIEND_REQUESTS })
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  sender: User;

  @OneToOne(() => User)
  @JoinColumn()
  receiver: User;

  @Column()
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
