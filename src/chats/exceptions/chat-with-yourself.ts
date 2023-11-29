import { HttpException, HttpStatus } from '@nestjs/common';

export class ChatWithYourselfException extends HttpException {
  constructor() {
    super("You can't initiate chat with yourself.", HttpStatus.FORBIDDEN);
  }
}
