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

import { EventsService } from './events.service';

@WebSocketGateway(5120, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const token: string = client.handshake.auth.token;

    const { id, username } = this.jwtService.verify(token);

    console.log(
      `Client connected: ${client.id}\ndata from token: ${id} ${username}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('echo')
  echo(@MessageBody() data: any) {
    return `${data.toUpperCase()} <- its a message from a server`; // return ... -> response to a sender
  }

  @SubscribeMessage('send-message')
  sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('receive-message', data.message.toUpperCase()); // to ALL connected clients except sender
    // this.server.emit('receive-message', data.message.toUpperCase()); // to ALL connected clients
  }
}
