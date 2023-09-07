import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  signIn() {
    return 'This action signs in a user';
  }

  signUp() {
    return 'This action signs up a user';
  }
}
