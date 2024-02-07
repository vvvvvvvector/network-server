import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { MessagesService } from 'src/messages/messages.service';
import { ChatsService } from 'src/chats/chats.service';
import { UsersService } from 'src/users/users.service';

import { SendMessageDto } from './dtos/send-message.dto';

import type { UserTokenPayload } from 'src/auth/auth.service';
type SocketId = string;

@WebSocketGateway(5120, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  private activeConnections = new Map<SocketId, UserTokenPayload>();

  private getSocketIdByUsername(username: string) {
    for (const [socketId, user] of this.activeConnections.entries()) {
      if (user.username === username) return socketId;
    }
  }

  handleConnection(client) {
    try {
      const user = this.jwtService.verify<UserTokenPayload>(
        client.handshake.auth.token as string | undefined,
      ); // to do: handle error if token is not provided or expired?

      client.broadcast.emit('network-user-online', user.username);

      client.join(user.username);
      this.activeConnections.set(client.id, user);

      console.log(`A client has connected: ${user.username}`);
    } catch (error) {
      console.log('token is not provided or expired. disconnecting...');

      client.disconnect();
    }
  }

  async handleDisconnect(client) {
    try {
      const user = this.jwtService.verify<UserTokenPayload>(
        client.handshake.auth.token as string | undefined,
      ); // to do: handle error if token is not provided or expired?

      client.broadcast.emit('network-user-offline', user.username);

      await this.usersService.updateLastSeenDateAndTime(
        this.activeConnections.get(client.id).id,
      );

      client.leave(user.username);
      this.activeConnections.delete(client.id);

      console.log(`A client has disconnected: ${user.username}`);
    } catch (error) {
      console.log('token is not provided or expired. disconnecting...');

      client.disconnect();
    }
  }

  @SubscribeMessage('which-friends-online')
  isFriendsInMessengerOnline(@MessageBody() friends: string[]) {
    return friends.reduce(
      (accumulator, currentValue) =>
        Object.assign(accumulator, {
          [currentValue]: this.getSocketIdByUsername(currentValue)
            ? 'online'
            : 'offline',
        }),
      {},
    );
  }

  @SubscribeMessage('is-friend-online')
  isFriendOnline(@MessageBody() username: string) {
    return !!this.getSocketIdByUsername(username);
  }

  @SubscribeMessage('typing')
  userTyping(
    @MessageBody()
    data: {
      to: string;
    },
    @ConnectedSocket() client,
  ) {
    client.to(data.to).emit('typing');
  }

  @SubscribeMessage('typing-stop')
  userStopTyping(
    @MessageBody()
    data: {
      to: string;
    },
    @ConnectedSocket() client,
  ) {
    client.to(data.to).emit('typing-stop');
  }

  @SubscribeMessage('send-private-message')
  async sendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client,
  ) {
    const senderUsername = this.activeConnections.get(client.id).username;

    const message = await this.messagesService.createMessage(
      data.content,
      data.chatId,
      this.activeConnections.get(client.id).id,
    );

    await this.chatsService.updateChatLastMessage(
      message.chat.id,
      message.content,
      message.createdAt,
    );

    client.to(data.receiver).emit('receive-private-message', {
      ...message,
      sender: {
        username: senderUsername,
      },
    });

    return {
      ...message,
      sender: {
        username: senderUsername,
      },
    };
  }
}
