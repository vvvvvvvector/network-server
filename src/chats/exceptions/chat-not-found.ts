import { HttpException, HttpStatus } from '@nestjs/common';

export class ChatNotFoundException extends HttpException {
  constructor() {
    super('Chat not found.', HttpStatus.NOT_FOUND);
  }
}
