import { HttpException, HttpStatus } from '@nestjs/common';

export class MyselfFriendRequestException extends HttpException {
  constructor() {
    super('You cannot send friend request to yourself.', HttpStatus.FORBIDDEN);
  }
}
