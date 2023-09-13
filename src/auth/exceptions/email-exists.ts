import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailExistsException extends HttpException {
  constructor() {
    super('User with this email already exists.', HttpStatus.FORBIDDEN);
  }
}
