import { HttpException, HttpStatus } from '@nestjs/common';

export class ChatAlreadyExistsException extends HttpException {
  constructor() {
    super('The chat already exists', HttpStatus.FORBIDDEN);
  }
}
