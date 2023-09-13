import { HttpException, HttpStatus } from '@nestjs/common';

export class NotReceiverRejectException extends HttpException {
  constructor() {
    super(
      "You can't reject this request because you aren't the receiver. Receiver decides to accept or to reject this friend request.",
      HttpStatus.FORBIDDEN,
    );
  }
}
