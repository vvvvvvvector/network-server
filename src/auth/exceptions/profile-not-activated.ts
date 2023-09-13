import { HttpException, HttpStatus } from '@nestjs/common';

export class ProfileNotActivatedException extends HttpException {
  constructor() {
    super('This profile is not activated.', HttpStatus.UNAUTHORIZED);
  }
}
