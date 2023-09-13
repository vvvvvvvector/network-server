import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameExistsException extends HttpException {
  constructor() {
    super('User with this username already exists.', HttpStatus.FORBIDDEN);
  }
}
