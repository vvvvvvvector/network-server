import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';

import { TABLES } from 'src/utils/constants';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: TABLES.CHATS })
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  initiator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  addressee: User;

  @Column({ nullable: true })
  lastMessageContent: string;

  @UpdateDateColumn({
    nullable: true,
  })
  lastMessageSentAt: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
