import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestHasAlreadyBeenCreatedException extends HttpException {
  constructor() {
    super(
      'Friend request with this user has already been created.',
      HttpStatus.FORBIDDEN,
    );
  }
}
