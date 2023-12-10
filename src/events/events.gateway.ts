import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { Socket, Server } from 'socket.io';

import { MessagesService } from 'src/messages/messages.service';
import { ChatsService } from 'src/chats/chats.service';
import { UsersService } from 'src/users/users.service';
import type { UserTokenPayload } from 'src/auth/auth.service';

import { SendMessageDto } from './dtos/send-message.dto';

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
    for (let [socketId, user] of this.activeConnections.entries()) {
      if (user.username === username) return socketId;
    }
  }

  handleConnection(client: Socket) {
    try {
      const user = this.jwtService.verify<UserTokenPayload>(
        client.handshake.auth.token as string | undefined,
      ); // to do: handle error if token is not provided or expired?

      // if user is already connected
      if (!!this.getSocketIdByUsername(user.username)) {
        client.disconnect();

        return;
      }

      this.activeConnections.set(client.id, user);

      client.broadcast.emit(
        'user-connected',
        this.activeConnections.get(client.id).username,
      );

      console.log(
        `1) New connection: ${client.id}\n2) Connection data: ${user.id} ${user.username}`,
      );
    } catch (error) {
      console.log('token is not provided or expired. disconnecting...');

      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`A client has disconnected: ${client.id}`);

    await this.usersService.updateLastSeenDateAndTime(
      this.activeConnections.get(client.id).id,
    );

    client.broadcast.emit(
      'user-disconnected',
      this.activeConnections.get(client.id).username,
    );

    this.activeConnections.delete(client.id);
  }

  @SubscribeMessage('is-friend-online')
  isFriendOnline(@MessageBody() username: string) {
    return !!this.getSocketIdByUsername(username);
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const messageReceiverSocketId = this.getSocketIdByUsername(data.receiver); // if user is online socketId will be returned, else undefined

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

    client.to(messageReceiverSocketId).emit('receive-message', {
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
