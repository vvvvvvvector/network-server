import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TABLES } from 'src/utils/constants';
import { User } from 'src/users/entities/user.entity';
import { Chat } from 'src/chats/entities/chat.entity';

@Entity({ name: TABLES.MESSAGES })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;
}
