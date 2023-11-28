import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TABLES } from 'src/utils/constants';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: TABLES.MESSAGES })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}
