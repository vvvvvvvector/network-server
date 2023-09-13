import { HttpException, HttpStatus } from '@nestjs/common';

export class NotReceiverAcceptException extends HttpException {
  constructor() {
    super(
      "You can't accept this request because you aren't the receiver. Receiver decides to accept or to reject this friend request.",
      HttpStatus.FORBIDDEN,
    );
  }
}
